const User = require('../models/userModel');
const category = require('../models/categoryModel'); 
const product = require('../models/productModel'); 
const admin = require('../models/adminModel'); 
const order = require('../models/orderModel'); 


const loadLogin = async (req, res) => {
   try {
      const err = req.query.err;
      const msg = req.query.msg;
      console.log(typeof err);
      if (err) {
         res.render('login', {message: '', errMessage: msg })
      } else {
         res.render('login', {message: msg , errMessage: '' })
      }
   } catch (error) {
      console.log(error.message);
   }
}

const verifyUser = async (req, res) => {

   try {
      const email = req.body.email;
      const password = req.body.password;

      const adminData = await admin.findOne({ email: email });
      console.log(adminData);

      if (adminData) {
         if (adminData.password === password) {
               req.session.admin_id = adminData._id;
               res.redirect('/admin/home');
         } else {
         res.redirect(`/admin/?err=${true}&msg=Invalid Password`);
         }
      } else {
         res.redirect(`/admin/?err=${true}&msg=Invalid Email`);
      }
   } catch (error) {
      console.log(error.message);
   }
}

const loadhome = async (req, res) => {
   try {
      if(req.session.admin_id){
         res.render('home');
      }else{
         res.redirect('/admin')
      }
   } catch (error) {
      console.log(error.message)
   }
}

const logout = async (req, res) => {
   try {
      req.session.admin_id = null;
      res.redirect('/admin')
   } catch (error) {
      console.log(error.message)
   }
}

const categories = async (req, res) => {
   try {
         const err = req.query.err;
         const msg = req.query.msg;
         console.log(typeof err);
         const categorieData = await category.find({});
         if (err) {
            res.render('categories', {categories:categorieData, message: '', errMessage: msg })
         } else {
            res.render('categories', {categories:categorieData, message: msg , errMessage: '' })
         }
    console.log("Reached categories");

   } catch (error) {
      console.log(error.message)
   }
}

const addCategories = async (req, res) => {
  console.log("Reached addCategories");

   try {
      const categoryName = req.body.categoryName.trim();
  console.log("categoryName is "+categoryName);
      const newCategory = new category({
        name: categoryName,
      });

      const existingCategory = await category.findOne({ name: categoryName });
  
      if (existingCategory) {
         res.redirect(`/admin/categories?err=${true}&msg=Category name already exists`);
      }else{
  
      const savedCategory = await newCategory.save();
  
      res.redirect(`/admin/categories?err=${""}&msg=Category created successfully`);

      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
}

const editCategory = async (req, res) => {
   console.log("Reached editCategory");

   const categoryId = req.body.editCategoryId.trim();
   const newName = req.body.editCategoryName.trim();   
   console.log("newName "+newName);
   console.log("categoryId "+categoryId);
   try {

      const existingCategory = await category.findOne({ name: newName });
  
      if (existingCategory) {
         res.redirect(`/admin/categories?err=${true}&msg=Category name already exists`);
      }else{
       const updatedCategory = await category.findByIdAndUpdate(categoryId, { name: newName }, { new: true });
       console.log("Reached editCategory and finished updating the category name");

       res.redirect(`/admin/categories?err=${""}msg=Category updated successfully`);
      }
   } catch (error) {
       res.redirect(`/admin/categories?err=${true}&msg=Failed to update category`);
   }
}

const toggleBlockStatus = async (req, res) => {
   console.log("Reached toggleBlockStatus");
   try {

      const categoryId = req.params.categoryId;
      const blockStatus = req.body.blocked;
      console.log("categoryId is "+categoryId);
      console.log("blockStatus is "+blockStatus);
      console.log(typeof blockStatus);
  
      const categoryData = await category.findById(categoryId);

      console.log("categoryData "+categoryData);
  
      if (!categoryData) {
        return res.status(404).json({ message: 'Category not found' });
      }
  
      categoryData.blocked = blockStatus;
  
      await categoryData.save();
  
      return res.status(200).json({ message: 'Block status updated successfully' });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
}

const toggleBlockStatusProducts = async (req, res) => {
   console.log("Reached toggleBlockStatusProducts");
   try {

      const categoryId = req.params.categoryId;
      const blockStatus = req.body.blocked;
      console.log("categoryId is "+categoryId);
      console.log("blockStatus is "+blockStatus);
      console.log(typeof blockStatus);
  
      const categoryData = await product.findById(categoryId);

      console.log("categoryData "+categoryData);
  
      if (!categoryData) {
        return res.status(404).json({ message: 'Category not found' });
      }
  
      categoryData.blocked = blockStatus;
  
      await categoryData.save();
  
      return res.status(200).json({ message: 'Block status updated successfully' });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
}

const toggleBlockStatusUsers = async (req, res) => {
   console.log("Reached toggleBlockStatusUsers");
   try {

      const userID = req.params.userID;
      const blockStatus = req.body.blocked;
      console.log("userID is "+userID);
      console.log("blockStatus is "+blockStatus);
      console.log(typeof blockStatus);
  
      const userData = await User.findById(userID);

      console.log("categoryData "+userData);
  
      if (!userData) {
        return res.status(404).json({ message: 'Category not found' });
      }
  
      userData.blocked = blockStatus;
  
      await userData.save();
  
      return res.status(200).json({ message: 'Block status updated successfully' });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
}

const productsList = async (req, res) => {
   try {
      const categorieData = await category.find({});
      const productData = await product.find({});
         res.render('productsList', {categories:categorieData,products:productData})
   } catch (error) {
      console.log(error.message)
   }
}

const addProduct = async (req, res) => {
   try {
      const err = req.query.err;
      const msg = req.query.msg;
      console.log(typeof err);
      const categorieData = await category.find({});
      if (err) {
         res.render('addProduct', {categories:categorieData, message: '', errMessage: msg })
      } else {
         res.render('addProduct', {categories:categorieData, message: msg , errMessage: '' })
      }
   } catch (error) {
      console.log(error.message)
   }
}

const publishProduct = async (req, res) => {
   try {
      console.log("Reached publishProduct");
      if (!req.files[0] || req.files.length === 0) {
         res.redirect(`/admin/addProduct?err=${true}&msg=No images were uploaded`);
      }else if (req.files.length > 4) {
         res.redirect(`/admin/addProduct?err=${true}&msg=You can upload up to 3 images`);
     }else{
      const {
         product_name,
         description,
         regular_price,
         sales_price,
         size,
         brand,
         stock,
         color,
         material,
         shipping_fee,
         tax_rate,
         categoryId,
         type
      } = req.body;
         
         console.log("req.files.images " + req.files[0].filename);
         console.log("req.files " + req.files[0]);
         const img = [];
            

         for (let i = 0; i < req.files.length; i++) {
            img.push(req.files[i].filename);
         }

         const newProduct = new product({
            product_name,
            description,
            categoryId,
            regular_price,
            sales_price,
            brand_name: brand,
            stock,
            size,
            color,
            material,
            shipping_fee,
            tax_rate,
            type,
            images: img
         });

         const savedProduct = await newProduct.save();
         res.redirect(`/admin/addProduct?err=${""}&msg=Product and image uploaded successfully`);

      }
   } catch (error) {
      console.error(error);
      res.redirect(`/admin/addProduct?err=${true}&msg=Internal server error`);
   }
}

const editProducts = async (req, res) => {
   console.log("Reached editProducts ");

   try {
      const err = req.query.err;
      const msg = req.query.msg;
      const productId = req.query.productId;
      console.log("productId "+productId);
      const productData = await product.findById(productId).populate('categoryId');

      console.log(typeof err);
      const categorieData = await category.find({});
      if (err) {
         res.render('editProducts', {products:productData,categories:categorieData, message: '', errMessage: msg })
      } else {
         res.render('editProducts', {products:productData,categories:categorieData, message: msg , errMessage: '' })
      }
   } catch (error) {
      console.log(error.message)
   }
}

const updateProduct = async (req, res) => {
   const productId = req.params.productId;
   console.log("Reached updateProduct ");
   console.log("productId " + productId);
   console.log("Received JSON data:", req.body.removeImageIndices);
   const removeImageIndices = JSON.parse(req.body.removeImageIndices);
   
   try {
     const existingProduct = await product.findById(productId);
     console.log("existingProduct " + existingProduct);
     
     if (!existingProduct) {
        console.log("redirect to editProduct Product not found ");
        res.redirect(`/admin/editProduct?productId=${productId}&err=${true}&msg=Product not found`);
      }else if (req.files.length > 5) {
      console.log("redirect to editProduct You can upload up to 3 images ");
      res.redirect(`/admin/editProduct?productId=${productId}&err=${true}&msg=You can onlyupload upto 4 images`);
   }

     const {
       product_name,
       description,
       regular_price,
       sales_price,
       size,
       brand,
       stock,
       color,
       material,
       shipping_fee,
       tax_rate,
       categoryId,
     } = req.body;

     // Parse the removeImageIndices JSON string back to an array

   //   console.log("removeImageIndices " + removeImageIndices);

     // Remove images from the `img` array based on the indices
     const updatedImages = existingProduct.images.filter((_, index) => !removeImageIndices.includes(index));

     existingProduct.product_name = product_name;
     existingProduct.description = description;
     existingProduct.categoryId = categoryId;
     existingProduct.regular_price = regular_price;
     existingProduct.sales_price = sales_price;
     existingProduct.brand_name = brand;
     existingProduct.stock = stock;
     existingProduct.size = size;
     existingProduct.color = color;
     existingProduct.material = material;
     existingProduct.shipping_fee = shipping_fee;
     existingProduct.tax_rate = tax_rate;
     existingProduct.images = updatedImages; // Update the images with the filtered array

     await existingProduct.save();
     console.log("redirect to editProduct Product and image updated successfully ");
     res.redirect(`/admin/editProduct/${productId}?err=${""}&msg=Product and image updated successfully`);

   } catch (error) {
     console.error(error);
     console.log("redirect to editProduct Internal server error ");
     res.redirect(`/admin/editProduct/${productId}?err=${true}&msg=Internal server error`);
   }
 }

 

const loadAddUser = async (req, res) => {
   try {

      res.render('newUser', { message: '', errMessage: '' })

   } catch (error) {
      console.log(error.message)
   }
}

const userList = async (req, res) => {
   try {
      // const categorieData = await category.find({});
      const userData = await User.find({});
      console.log("users "+userData);
         res.render('userList', {users:userData})
   } catch (error) {
      console.log(error.message)
   }
}

const orderList = async (req, res) => {
   try {
      const orderData = await order.find({})
         .populate('user_id', 'first_name last_name email') // Populate user information
         .select('_id total_amount order_status created_on') // Select specific fields
         // .sort({ created_on: 1 }); // Sort by created_on in descending order

      // Reverse the order of orderData array
      orderData.reverse();

      res.render('orderList', { orders: orderData });
   } catch (error) {
      console.log(error.message);
   }
}


const ordersDetail = async (req, res) => {
   console.log("Reached ordersDetail");
   try {
      const orderId = req.params.orderId; // Assuming you can access the order ID from the request parameters

      // Use Mongoose's populate method to populate the necessary fields
      const orderData = await order.findById(orderId)
        .populate({
          path: 'user_id',
          model: User,
          select: 'first_name last_name email mobile addresses', // Select the user fields you need
        })
        .populate({
          path: 'items.product_id',
          model: product,
          select: 'product_name regular_price sales_price images', // Select the product fields you need
        })
        .exec();

      if (!orderData) {
        // Handle the case where the order with the provided ID does not exist
        return res.status(404).send('Order not found');
      }
      console.log("orderData : ",orderData);
      res.render('ordersDetail', { order: orderData });
   } catch (error) {
      console.log(error.message);
      res.status(500).send('Internal Server Error');
   }
}

const updateOrderStatus = async (req, res) => {
   try {
      console.log("Reached updateOrderStatus");
      const { orderId, selectedStatus } = req.body;
      console.log("orderId, selectedStatus : ",orderId, selectedStatus);

      // Update the order status in the database (using Mongoose in this example)
      await order.findByIdAndUpdate(orderId, { order_status: selectedStatus });

      // Respond with a success message
      res.json({ success: true, message: 'Order status updated successfully' });
  } catch (error) {
      // Handle errors and respond with an error message
      console.error(error);
      res.status(500).json({ success: false, message: 'Error updating order status' });
  }
}

const addUser = async (req, res) => {
   try {
      const checkData = await User.findOne({ email: req.body.email });
      if (checkData) {
         res.render('newUser', { message: '', errMessage: "User already Exists" })
      } else {
         const user = new User({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            password: req.body.password
         })

         const userData = await user.save()
         if (userData) {
            res.redirect('/admin/dashboard');
         }
      }


   } catch (error) {
      console.log(error.message)
   }
}

const editUserLoad = async (req, res) => {
   console.log("editUserLoad worked")
   try {
      const id = req.params.id;
      const users = await User.findById({ _id: id });
      if (users) {
         res.render('editUser', { users });
      } else {
         res.redirect('/admin/dashboard')
      }
   } catch (error) {
      console.log(error.message);
   }
}

const updateUser = async (req, res) => {
   try {
      console.log("updateUser worked")
      const userData = await User.findByIdAndUpdate({ _id: req.body.id }, { $set: { name: req.body.name, email: req.body.email, mobile: req.body.mobile } })
      res.redirect('/admin/dashboard')
   } catch (error) {
      console.log(error.message)
   }
}

const deleteUser = async (req, res) => {
   try {
      console.log("deleteUser worked")
      const userData = await User.findOneAndRemove({ _id: req.params.id });
      res.redirect('/admin/dashboard');
   } catch (error) {
      console.log(error.message)
   }
}

const searchUser = async (req, res) => {
   console.log("Reached searchUser");
   try {
      const searchInput = (req.body.name);
      console.log("searchInput "+searchInput);
      const usersData = await User.find({
         $or: [
           { first_name: { $regex: searchInput, $options: 'i' } },
           { last_name: { $regex: searchInput, $options: 'i' } },
           { display_name: { $regex: searchInput, $options: 'i' } },
           { email: { $regex: searchInput, $options: 'i' } }
         ]
       }).sort({ name: 1 });
             res.render('userList', { users: usersData });
   } catch (error) {
      console.log(error.message)
   }
}

module.exports = {
   loadLogin,
   verifyUser,
   loadhome,
   logout,
   loadAddUser,
   addUser,
   editUserLoad,
   updateUser,
   deleteUser,
   searchUser,
   categories,
   productsList,
   addProduct,
   addCategories,
   editCategory,
   toggleBlockStatus,
   publishProduct,
   toggleBlockStatusProducts,
   editProducts,
   updateProduct,
   userList,
   toggleBlockStatusUsers,
   orderList,
   ordersDetail,
   updateOrderStatus
}

