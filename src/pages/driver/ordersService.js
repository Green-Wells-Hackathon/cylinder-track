import { collection, query, where, onSnapshot, getDoc, doc, orderBy } from "firebase/firestore";
import { db } from "../../../firebase";

export function getOrdersRealtime(callback, options = {}) {
  const colRef = collection(db, 'orders');
  let q;
  if (options?.statusArray && options.statusArray.length) {
    q = query(colRef, orderBy(options.orderByField || 'created_at', 'desc'));
  } else {
    q = query(colRef, orderBy(options.orderByField || 'created_at', 'desc'));
  }

  const unsub = onSnapshot(q, snapshot => {
    const out = snapshot.docs.map(d => mapOrderDoc(d.id, d.data()));
    if (options?.statusArray && options.statusArray.length) {
      const filtered = out.filter(o => {
        const st = o.status;
        if (Array.isArray(st)) {
          return st.some(s => options.statusArray.includes(String(s).toLowerCase()));
        }
        return options.statusArray.includes(String(st).toLowerCase());
      });
      callback(filtered);
      return;
    }
    callback(out);
  }, err => {
    console.error('orders onSnapshot error', err);
    callback([]);
  });

  return unsub;
}

export async function getOrderById(orderId) {
  if (!orderId) return null;
  try {
    const d = await getDoc(doc(db, 'orders', orderId));
    if (!d.exists()) return null;
    return mapOrderDoc(d.id, d.data());
  } catch (err) {
    console.error('getOrderById error', err);
    return null;
  }
}


function mapOrderDoc(id, data) {
  const buyer = data?.customer_name || data?.customer_name || 'Unknown';
  const gases = (() => {
    if (Array.isArray(data?.cylinder_ids) && data.cylinder_ids.length) return String(data.cylinder_ids.length).padStart(2, '0');
    if (Array.isArray(data?.cylinders) && data.cylinders.length) return String(data.cylinders.length).padStart(2, '0');
    if (data?.amount && data?.cylinders?.length) return String(data.cylinders.length).padStart(2, '0');
    return data?.gases || '01';
  })();

  const statusRaw = data?.status ?? data?.status_history?.[0]?.status ?? 'pending';
  const status = Array.isArray(statusRaw) ? statusRaw[0] : statusRaw;

  const location = data?.destination_location?.address || data?.customer_address || data?.location || 'Unknown location';
  const date = data?.delivery_date || data?.estimated_delivery_time || data?.start_time || data?.created_at || data?.date || '';
  const coords = data?.destination_location ? { lat: Number(data.destination_location.latitude), lng: Number(data.destination_location.longitude) } : (data?.coords || null);

  return {
    id: id,
    buyer: buyer,
    gases: gases,
    status: typeof status === 'string' ? capitalize(status) : status,
    location,
    date: date && date.toDate ? date.toDate().toLocaleDateString() : (typeof date === 'string' ? date : ''),
    coords,
    orderFull: data 
  };
}

function capitalize(s) {
  if (!s) return s;
  return String(s).charAt(0).toUpperCase() + String(s).slice(1);
}