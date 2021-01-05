const socket = io('/')
const vidgrid = document.getElementById('video-grid')
const mypeer= new Peer(undefined,{
    host:'/',
    port:'3001'
})
const myvid = document.createElement('video')
myvid.muted= true
const peer={}
navigator.mediaDevices .getUserMedia({
    video:true,
    audio:true 
}).then(stream=>{
    addvideostream(myvid, stream)
 
    mypeer.on(`call`, call =>{
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', uservideoStream =>{
            addvideostream(video, uservideoStream)
        })
    })

    socket.on('user connected',userid=>{
       connectToNewuser(userid,stream)
    })
})

socket.on('user-disconnecte', userid =>{
   if(peers[userid]) peers[userid].close()
})

mypeer.on('open', id =>{
    socket.emit('join-room', RoomID, id)
}) 

function  connectToNewuser(userid,stream) {
    var call= mypeer.call(userid,stream)
    var video=document.createElement('video')
    call.on('stream', uservidstream => {
        addvideostream(video,uservidstream)
    })
    call.on('close', () =>{
        video.remove()
    })
    peers[userid] = call
}



function addvideostream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata',()=>{
     video.play();   
    })
    vidgrid.append(video)
}