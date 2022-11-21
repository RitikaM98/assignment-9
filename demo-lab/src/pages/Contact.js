import React from 'react'
import Navbar from './Navbar'
import Content from './Content'
import List from './List';

function Contact(){
    
      const contacts = [
        {
            id: 1,
            name: "Ritika Mangamuru ",
            contact: 9999999999
        },
        {
            id: 2,
            name: "User 2",
            contact: 9999999998 
        },
        {
            id: 3,
            name: "User 3",
            contact: 9999999988
        }
        
    ];

    return(
      <div>
      <Navbar/>
      <Content title="Contact" content=" Welcome to contact Page"/>
      {contacts.map(contact => (<List
        id = {contact.id}
        name = {contact.name}
        contact = {contact.contact}
      />))}
      </div>
    )
}

export default Contact