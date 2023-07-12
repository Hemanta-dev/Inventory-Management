const express = require('express');
require('dotenv').config();
const axios = require('axios');
const jwt_decode = require('jwt-decode');


const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('../db');
const Register = require('../models/registers');
const Authenticate = require('../middleware/authenticate');
const Authenticateadmin = require('../middleware/authAdmin');

const passport = require("passport");

const User =  require("../models/oAuthRegister");

const Items = require("../models/items");

const ItemsRequest = require("../models/requestItem");










router.get('/', (req, res) => {
  res.send("This is the home page");
});



// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Please fill in all the fields" });
    }

    const userLogin = await Register.findOne({ email: email });
    console.log({ userLogin });

    if (!userLogin) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    if (!userLogin.isApproved) {
      return res.status(401).json({ error: "Account not approved. Please wait for approval" });
    }

    const isMatch = bcrypt.compareSync(password, userLogin.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = await userLogin.generateAuthToken();

    res.json({ token: token, message: "User logged in successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});



// Register
router.post('/register', async (req, res) => {
  const { email, password, confirmPassword, location } = req.body;
  if (!email || !password || !confirmPassword || !location) {
    return res.status(422).json({ error: "Please fill all the fields" });
  }

  try {
    const userExists = await Register.findOne({ email: email });
    if (userExists) {
      return res.status(422).json({ error: "User already exists" });
    }

    const saltRounds = 10;
    const passwordHash = bcrypt.hashSync(password, saltRounds);

    const registrationRequest = new Register({
      email: email,
      password: passwordHash,
      confirmPassword: passwordHash,
      location: location,
      isApproved: false // Set isApproved to false initially
    });

    await registrationRequest.save();
    res.status(201).json({ message: "Registration request submitted for approval" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to submit registration request" });
  }
});

// Request User after signup for approval
router.get('/register-list', Authenticateadmin, async (req, res) => {
  try {

    if(req.role == 'superuser'){
      const pendingUsers = await Register.find({ isApproved: false });
      res.status(200).json({ pendingUsers });

    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to show user registration list" });
  }

  
});

// Request User list after signup through google for approval
router.get('/oauth-register-list', Authenticateadmin, async (req, res) => {
  try {

    if(req.role == 'superuser'){
      const pendingUsers = await User.find({ isApproved: false });
      res.status(200).json({ pendingUsers });

    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to show user registration list" });
  }

  
});



//approve and reject 

// router.put('/approve/:id', Authenticateadmin, async (req, res) => {
//   try {
    
//     if (req.role !== 'superuser') {
//       return res.status(401).json({ error: "Unauthorized to approve/reject registration requests" });
//     }

//     const { id } = req.params;

//     const registrationRequest = await Register.findByIdAndUpdate(
//       id,
//       { isApproved: true },
//       { new: true }
//     );

//     if (!registrationRequest) {
//       return res.status(404).json({ error: "Registration request not found" });
//     }

//     res.json({ message: "Registration request approved successfully" });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Failed to approve registration request" });
//   }
// });

//now approve request
router.put('/approve/:id', Authenticateadmin, async (req, res) => {
  try {
    if (req.role !== 'superuser') {
      return res.status(401).json({ error: "Unauthorized to approve/reject registration requests" });
    }

    const { id } = req.params;

    const registrationRequest = await Register.findByIdAndUpdate(
      id,
      { isApproved: true },
      { new: true }
    );

    if (!registrationRequest) {
      return res.status(404).json({ error: "Registration request not found" });
    }

    res.json({ message: "Registration request approved successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to approve registration request" });
  }
});

//oauth aprrove 
//now approve request
router.put('/google-approve/:id', Authenticateadmin, async (req, res) => {
  try {
    if (req.role !== 'superuser') {
      return res.status(401).json({ error: "Unauthorized to approve/reject registration requests" });
    }

    const { id } = req.params;

    const registrationRequest = await User.findByIdAndUpdate(
      id,
      { isApproved: true },
      { new: true }
    );

    if (!registrationRequest) {
      return res.status(404).json({ error: "Registration request not found" });
    }

    res.json({ message: "Registration request approved successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to approve registration request" });
  }
});


//now reject request

router.put('/reject/:id', Authenticateadmin, async (req, res) => {
  try {
    if (req.role !== 'superuser') {
      return res.status(401).json({ error: "Unauthorized to approve/reject registration requests" });
    }

    const { id } = req.params;

    const registrationRequest = await Register.findByIdAndDelete(id);

    if (!registrationRequest) {
      return res.status(404).json({ error: "Registration request not found" });
    }

    res.json({ message: "Registration request rejected successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to reject registration request" });
  }
});

//oauth google reject request

router.put('/google-reject/:id', Authenticateadmin, async (req, res) => {
  try {
    if (req.role !== 'superuser') {
      return res.status(401).json({ error: "Unauthorized to approve/reject registration requests" });
    }

    const { id } = req.params;

    const registrationRequest = await User.findByIdAndDelete(id);

    if (!registrationRequest) {
      return res.status(404).json({ error: "Registration request not found" });
    }

    res.json({ message: "Registration request rejected successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to reject registration request" });
  }
});








  

// Logout
router.get('/logout', Authenticate, async (req, res) => {
  try {
    req.rootUser.tokens = [];
    await req.rootUser.save();

    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to logout' });
  }
});

// Home
// router.get("/home", Authenticateadmin, (req, res) => {
  
//   if (req.role === 'superuser') {
//     return res.status(200).json(data);
//   } else {
//     return res.status(200).json(data);
//   }
// });


router.get("/home", Authenticateadmin, (req, res) => {
  try {
    let data = {};

    if (req.role === 'superuser') {
      data = {
        message: "Welcome, superuser!",
        role: req.role
      };
    } else {
      data = {
        message: "Welcome, user!",
        role: req.role
      };
    }

    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});



// Create default superuser
router.post('/createsuperuser', async (req, res) => {
  try {
    const { email, password, confirmPassword, location } = req.body;

    if (!email || !password || !confirmPassword || !location) {
      return res.status(422).json({
         error: "Please fill all the fields" 
        });
    }

    const userExists = await Register.findOne({ email: email });
    if (userExists) {
      return res.status(422).json({ error: "User already exists" });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const superuser = new Register({
      email: email,
      password: passwordHash,
      confirmPassword: passwordHash,
      location: location,
      role: 'superuser',
      isApproved:true 
    });

    await superuser.save();

    res.status(201).json({ message: "Default superuser created successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to create default superuser" });
  }
});

//important of Google Auth


// Login with Google
// router.post('/google/login', async (req, res) => {
//   console.log(req.body.token,"66666666666666666666666666666666666")
//   try {
//     if (req.body.token) {
//       const { token } = req.body;
//       console.log(req.body.token,"77777777777777777");
//       var decodedToken = jwt_decode(token);
//       console.log(decodedToken,"8888888888888888888888888");

//       if (decodedToken) {
//         const email = decodedToken.email;
//         const existingUser = await User.findOne({ email });

//         if (existingUser)
//           res.status(200).json({ msg: "User successfully login" });
//       }
//     }
//   } catch (error) {
//     console.log({ error });
//   }
// });



// Login with Google

router.post('/google/login', async (req, res) => {
  try {
    if (req.body.token) {
      const { token } = req.body;
      var decodedToken = jwt.decode(token);

      if (decodedToken) {
        const email = decodedToken.email;
        const existingUser = await User.findOne({ email });
       
        if (!existingUser.isApproved) {
          return res.status(500).json({ msg: "Please wait for approval" });
        }

        if (!existingUser) {
          return res.status(500).json({ msg: "User not found" });
        }

        // Generate an access token
        const token = await existingUser.generateAuthToken();
        console.log(token,"+++++++++++++++++++++++++++++++++++++++++++++++++")
        // const accessToken = jwt.sign({ email }, 'your-secret-key', { expiresIn: '1h' });

        return res.status(200).json({ msg: "User successfully logged in", token });
      }
    }

    return res.status(400).json({ msg: "Invalid token" });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ msg: "An error occurred during authentication" });
  }
});



// Signup with Google
router.post('/google/signup', async (req, res) => {
 
  try {
    if (req.body.token) {
      const { token } = req.body;
  
      // const response = await axios.get(
      //   "https://www.googleapis.com/oauth2/v3/userinfo",
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token }`,
      //     },
      //   }
      // );
      var decodedToken = jwt_decode(token);
      console.log(decodedToken);

      if (decodedToken) {
        const email = decodedToken.email;
        // const firstname = response.data.given_name;
        // const lastname = response.data.family_name;
        const username = decodedToken.name;


        const existingUser = await User.findOne({ email });

        if (existingUser)
          return res.status(404).json({ message: "User already exists!" });

        const user = new User({
          username:username,
          email:email,
          isApproved: false
          
         
        });

        await user.save();

        res.status(200).json({ msg: "User successfully registered" });
      }
    }
  } catch (error) {
    console.log({ error });
  }
});


//items add


// router.post('/items-add', async (req, res) => {
//   console.log(req.body,'99999999999999999999999999999999999')
//   const { itemsName, itemsUnits, damageItemsUnits, remarks} = req.body;
//   if (!itemsName || !itemsUnits || !damageItemsUnits || !remarks) {
//     return res.status(422).json({ error: "Please fill all the fields" });
//   }

//   try {
//     const itemsExists = await Items.findOne({  itemsName: itemsName });
//     if (itemsExists ) {
//       return res.status(422).json({ error: "Items already exists" });
//     }
//     const itemsAdd = new Items({
//       itemsName: itemsName,
//       itemsUnits: itemsUnits,
//       damageItemsUnits: damageItemsUnits,
//       remarks: remarks,
   
//     });

//     await itemsAdd.save();
//     res.status(201).json({ message: "Items Added Successfully" });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Failed to Add items!" });
//   }
// });


//Items add router

const multer = require('multer');
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } }).single('file');

router.post("/items-add", async (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      // Multer error occurred, handle it
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({ error: "Payload Too Large" });
      } else {
        return res.status(500).json({ error: "Internal Server Error" });
      }
    } else if (err) {
      // Other error occurred, handle it
      console.log(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const { itemsName, itemsUnits, damageItemsUnits, remarks, imageUrl, selectedFileName } = req.body;

    if (!itemsName || !itemsUnits || !damageItemsUnits || !remarks) {
      return res.status(422).json({ error: "Please fill all the fields" });
    }

    try {
      const itemsExists = await Items.findOne({ itemsName: itemsName });

      if (itemsExists) {
        return res.status(422).json({ error: "Items already exists" });
      }

      const itemsAdd = new Items({
        itemsName: itemsName,
        itemsUnits: itemsUnits,
        damageItemsUnits: damageItemsUnits,
        remarks: remarks,
        imageUrl: imageUrl, // Save the image URL,
        selectedFileName: selectedFileName,
      });

      await itemsAdd.save();
      res.status(201).json({ message: "Items Added Successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Failed to Add items!" });
    }
  });
});

//item list

// Request User list after signup through google for approval
// router.get('/items-list', Authenticateadmin, async (req, res) => {
//   try {

//     if(req.role == 'superuser' || req.role == 'user'){
//       const itemsList = await Items.find();
//       console.log(itemsList,"--------------------------------");
//       res.status(200).json({ itemsList });

//     }
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Failed to show items list" });
//   }

  
// });

//delete items api delete-items
router.delete('/delete-items/:id', Authenticateadmin, async (req, res) => {
  try {
    if (req.role !== 'superuser') {
      return res.status(401).json({ error: "Unauthorized to delete items!" });
    }

    const { id } = req.params;

    const itemsDelete = await Items.findByIdAndDelete(id);

    if (!itemsDelete) {
      return res.status(404).json({ error: "Items are not found" });
    }

    res.json({ message: "Items Deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete the items!" });
  }
});


// GET item API: get-item-by-id

router.get('/get-item/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Items.findById(id);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json({ item });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch the item!" });
  }
});



// // Update items API: update-items

router.put('/update-items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFields = req.body;

    const updatedItem = await Items.findByIdAndUpdate(id, updatedFields, { new: true });

    if (!updatedItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json({ message: "Item updated successfully", updatedItem });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to update the item!" });
  }
});

router.get('/items-list/:id', Authenticateadmin, async (req, res) => {
  try {
    if ( req.role === 'user') {
      const itemId = req.params.id;
      const item = await Items.findById(itemId);
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
      res.status(200).json({ item });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to retrieve item' });
  }
});


//User Items  Request router


router.post("/items-request", async (req, res) => {

    const { itemsName, itemsUnits,message ,email } = req.body;

    if (!itemsName || !itemsUnits || !message) {
      return res.status(422).json({ error: "Please fill all the fields" });
    }

    try {
      // const itemsExists = await ItemsRequest.findOne({ itemsName: itemsName });

      // if (itemsExists) {
      //   return res.status(422).json({ error: "Items already exists" });
      // }

      const itemsRequest = new ItemsRequest({
        itemsName: itemsName,
        itemsUnits: itemsUnits,
        message: message,
        email:email
      });

      await itemsRequest.save();
      res.status(201).json({ message: "Items Requested Successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Failed to Request items!" });
    }
  });


  //user items request list

  router.get("/items-user-request",async(req,res)=>{
    try{
      const itemUserRequest = await ItemsRequest.find();
      if(!itemUserRequest.isApproved ){
        res.status(200).json({messsage:"successfully load the list",itemUserRequest});
      }

    }catch(error){
      console.log(error);
      res.status(500).json({message:"failed to load list"});

    }
    })

  //user items request list Reject action

router.delete('/items-user-request-reject/:id',  async (req, res) => {
  try {
    // if (req.role !== 'superuser') {
    //   return res.status(401).json({ error: "Unauthorized to approve/reject registration requests" });
    // }

    const { id } = req.params;

    const userRequestRejectRequest = await ItemsRequest.findByIdAndDelete(id);

    if (!userRequestRejectRequest) {
      return res.status(404).json({ error: "Delete request not found" });
    }

    res.json({ message: "User request for items rejected successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to reject user request for items request" });
  }
});

//now user request which came from user approve request
router.put('/items-user-request-reject/:id', async (req, res) => {
  try {
     
    const { id } = req.params;

    const userItemRequestAccept = await ItemsRequest.findByIdAndUpdate(
      id,
      { isApproved: true },
      { new: true }
    );

    if (!userItemRequestAccept ) {
      return res.status(404).json({ error: "User item request for item not found" });
    }

    res.json({ message: "User request for item approved successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to approve User request for item" });
  }
});


///////
// const itemsList = [
//   {
//     "_id": "64a3e2be6508505fc0dc18a5",
//     "itemsName": "laptop",
//     "itemsUnits": 20,
//   }
// ];

// const itemUserRequest = [
//   {
//     "_id": "64a79d12cc6d160fa3fb9699",
//     "itemsName": "laptop",
//     "itemsUnits": 5,
//     "message": "i want it",
//     "email": "sete999@gmail.com",
//     "isApproved": true,
//   },
// ];

// // Find the item in itemsList based on the request
// const requestedItem = itemUserRequest.find((request) => request.itemsName === "laptop");

// if (requestedItem && requestedItem.isApproved) {
//   // Find the item in itemsList based on _id and itemsName
//   const selectedItem = itemsList.find((item) => item._id === requestedItem._id && item.itemsName === requestedItem.itemsName);

//   if (selectedItem) {
//     // Deduct the requested units from itemsUnits
//     selectedItem.itemsUnits -= requestedItem.itemsUnits;

//     console.log("Updated itemsList:", itemsList);
//   } else {
//     console.log("Item not found in itemsList.");
//   }
// } else {
//   console.log("Item request not approved.");
// }
// Request User list after signup through google for approval
router.get('/items-list', Authenticateadmin, async (req, res) => {
  try {
    if (req.role == 'superuser' || req.role == 'user') {
      const itemsList = await Items.find();
      const itemUserRequest = await ItemsRequest.find();
      itemsList.forEach((item,index)=>{
          const itemsMatching = itemUserRequest.find((itemsRequest)=> itemsRequest.itemsName == item.itemsName );
            if(itemsMatching && itemsMatching.isApproved){
              const difference = item.itemsUnits - itemsMatching.itemsUnits;
              item.itemsUnits = difference;
            }else {
              item.itemsUnits;
            }
          })
      res.status(200).json({itemsList});
   
    } 
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to show items list" });
  }
});


















module.exports = router;
