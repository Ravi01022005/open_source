import React, { useContext, useEffect } from 'react';
import { items_from_json } from '../wrapper/context_from_json';
import { Link } from 'react-router-dom';
import Button from '../ATOMS/button';
import { countCreate } from '../wrapper/cartcount';
import axios from 'axios';

export default function Cart() {
  const { items, setItems, calculateTotalCount, Total } = useContext(items_from_json);
  const { setCount } = useContext(countCreate);

  useEffect(() => {
    const a=calculateTotalCount(items);
setCount(a)
Total(items)
   }, [items, calculateTotalCount, setCount]);

  const remover = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/posts/${id}`);
      const updatedItems = items.filter((item) => item.id !== id);
      let response=await axios.get("http://localhost:3000/posts")
      setItems(response.data)
      const a=calculateTotalCount(items)
      setCount(a)
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const updateCount = async(id, newCount) => {
    try {
        const updatedItem = items.filter(item =>item.id === id);
      updatedItem[0].count=newCount;
         await axios.put(`http://localhost:3000/posts/${id}`, {...updatedItem[0]});
         let response=await axios.get("http://localhost:3000/posts")
         setItems(response.data)
     } catch (error) {
      console.error("Failed to update count:", error);
    }
  };

  const totalAmount = Total(items);
  const tax = Number((totalAmount / 100) * 8);
  const order=totalAmount+tax+5;

  return (
    <div className='container d-flex justify-content-center' style={{ minHeight: "630px" }}>
      {items.length > 0 ? (
        <div className='container d-flex justify-content-between'>
          <div style={{ width: "900px" }}>
            {items.map((d, i) => (
              <div key={i} className='d-flex justify-content-evenly mt-5'>
                <div className="card" style={{ width: "20rem" }}>
                  <img src={d.product_details.image} className="card-img-top" alt={d.product_details.name} />
                  <div className="card-body">
                    <div className='d-flex justify-content-between'>
                      <p className="card-text text-center h4">{d.product_details.name}</p>
                      <div className='h5'>{d.product_details.price}</div>
                    </div>
                    <div className='mt-3'>
                      <label htmlFor={`count-${d.id}`}>Quantity: </label>
                      <select
                        id={`count-${d.id}`}
                        value={d.product_details.count}
                        onChange={(e) => updateCount(d.id, parseInt(e.target.value))}
                      >
                        {[...Array(20).keys()].map(n => (
                          <option key={n + 1} value={n + 1}>{n + 1}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div>
                  <Button onclick={() => remover(d.id)} content={"Remove"} className={"btn btn-warning rounded-3 text-light"} />
                </div>
                <br />
                </div>
            ))}
          </div>
          <div className='d-flex flex-column align-content-evenly rounded-3 h5 p-2 mt-5' style={{height:"300px",width:"400px",backgroundColor:"rgba(122, 121, 121, 0.164)"}}>
  <div className='d-flex justify-content-between'>
    <div>Subtotal</div>
    <div>$.{totalAmount}</div>
  </div> 
  <div className='d-flex justify-content-between'>
    <div>Shipping</div>
    <div>$.5</div>
  </div> 
  <div className='d-flex justify-content-between'>
    <div>Tax</div>
    <div>$.{tax}</div>
  </div> 
  <div className='d-flex justify-content-between'>
    <div>Order Total</div>
    <div>$.{order}</div>
  </div> 
</div>

        </div>
      ) : (
        <Link to="/Product"><div className='btn btn-warning p-3 text-light' style={{marginTop:"300px"}}>Add Product</div></Link>
      )}
    </div>
  );
}
