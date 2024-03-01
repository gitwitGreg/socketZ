import React from 'react'

type Conversations = {
  content: string
  createdAt: any
  id: string
  recipient: string | null
  roomId?: string | null
}



const Conversations = ({conversations, onSelectConversation }: {conversations: Conversations[], onSelectConversation : any}) => {
  if(!conversations.length){
    return(
      <div className="drawer lg:drawer-open h-auto w-auto">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-center">
        <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">Open drawer</label> 
      </div> 
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label> 
        <ul className="menu p-4 w-80 min-h-full bg-[#424549] text-whit gap-1">
          <li className='hover:bg-[#424549] text-white'>
            <h1>No messages</h1>
          </li>
        </ul>
      </div>  
   </div>
  )
  }

  return (
    <div>
        <div className="drawer lg:drawer-open h-screen">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col items-center justify-center">
                <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">Open drawer</label>
            </div> 
            <div className="drawer-side bg-[#424549] h-auto">
            {conversations.map((conversation, index) => (
              <div key={index}>
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label> 
                <ul className="menu p-4 w-80 min-h-full bg-[#1e2124] text-whit gap-1">
                  <li 
                  className='hover:bg-[#424549] text-white'
                  onClick={() => onSelectConversation(conversation.id)}>
                    <h1>{conversation.recipient}</h1>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </div>
    </div>
  )
}

export default Conversations
