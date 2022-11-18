/*==================================================
src/components/Credits.js

The Credits component contains information for Credits page view.
Note: You need to work on this file for the Assignment.
==================================================*/
import {Link} from 'react-router-dom';

const Credits = (props) => {
   
  let creditsView = () =>{
    const {credits} = props;
    return credits.map((credit) => {
      let date = credit.date.slice(0,10);
      return <l1 key={credit.id}>{credit.amount}{credit.description}{date}</l1>
    })
  }
  
  
  return (
    <div>
      <h1>Credits</h1>
      
      {creditsView()}

      <form onSubmit={props.addCredit}>
        <input type="text" name="description" />
        <input type="number" name="amount" />
        <button type="submit">Add Credit</button>
      </form>
      <br/>
      <Link to="/">Return to Home</Link>
    </div>
  )
}

export default Credits;