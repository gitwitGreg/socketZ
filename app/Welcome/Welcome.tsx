import React from 'react'
import { UserAccount } from '../ constants'

const Welcome = ({user}: {user: UserAccount}) => {
  return (
    <div className='h-screen w-auto p-20 gap-4 flex flex-col overflow-y-scroll '>

      <h1 className='text-2xl font-bold'>Welcome</h1>

      <hr className=' lg:w-[800px] md:w-[500px] mb-5'></hr>

      <div className='flex flex-col gap-4'>

        <h1 className='font-extrabold text-2xl'>socketZ</h1>

        <p className='font-semibold text-lg'>
          Is a chat application designed to make communcation
          with friends not only more private but more convenient as well.
        </p>

        <p className=' font-semibold text-lg'>
          To get started simply enter a username into the new message input box.
          Then enter what you would like to say to the user. Hit send and BOOM!! You
          have officially sent your first message. You can nivigate all your conversations
          on the left and section on the screen and see your messages on the right.
        </p>

        <h1 className='font-extrabold text-2xl'>
          ChatRooms
        </h1>

        <p className='font-semibold text-lg'>
          ChatRooms can either be created or joined. To create a chatRoom enter
          desired name into the input in the top right and hit enter. A message should be generated
          and a new conversation should apear in your conversations list. When joining a room enter
          the room name into the input in the top left and you should receive.
        </p>

        <h1 className='font-extrabold text-2xl'>
          Customization
        </h1>

        <p className='font-semibold text-lg'>
          Click the little person icon to cutomize your account settings. Alter things 
          such as username, password, bio, and profile picture.
        </p>

        <h1 className='font-extrabold text-2xl'>
          Future
        </h1>

        <p className='font-semibold text-lg'>
          Support for this application is present and ongoing. I will be looking to expand
          the customization for enhanced user experience. Profile picture included in messages
          are on the way as well as notifications for new messages. If you have any suggestions feel free
          to send me a message!
        </p>


      </div>
    </div>
  )
}

export default Welcome
