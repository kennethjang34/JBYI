# Real-Time Chat Application

## An application that allows user to send/receive messages instantaneously in group chat environment

_This project was started as a part of sub-parts of a project of building a community application for college students to share and discuss school specific material such as timetables or opinions about courses._

## Main features of the application

The application supports user authentication using Django REST Framework. When a user signs up, the server creates a user account model instance that is associated with a user model instance provided by Django. The account contains user name, his/her followers and other users they are following, chat-room instances the user has joined.
The user must login to use the application, which is done through Django REST Framework's token authentication. This token is required when building a connection between the client-side and the server-side for chat.

The application allows for real-time chat using WebSocket connection. When building the connection, the client-side will try to connect to the server using a URL that includes the user token it received when the user first signed in. Then the server will check if the user token is valid, and determine whether to accept the new connection.

Once connected, the client-side will send a request to the server using JSON to fetch the list of chat rooms the user has and each chat room's previous messages. To send a new message, user can just simply press enter or click the send button. The message sent to the server will need to have extra attributes in addition to the content. Those attributes include user id, chat room id's that the message was meant to be sent to. Upon receiving the new message, the server will create a message model instance through Django REST Framework's serializers, linking it to the associated user and chat room instances.

Client-side rendering was chosen for separation of concern and performance of the server. It was implemented using mainly React.js and Redux/React-Redux frameworks. Most global contexts are managed and passed to children by Redux store through mapStateToProps() and mapDispatchToProps(). Such global context variables stored by redux include user name, user token, messages loaded from the server, messages sent (only if the server response confirmed successful message delivery) and chat room selected.

For the overall UI, Boostrap framework's snippet was imported from the following address: https://www.bootdey.com/snippets/view/messages-like-material-design#js.
The snippet went through changes to suit this project.

CIP.
Current state of the development:
working on a feature for creating a new chat room with alert window of the browser
