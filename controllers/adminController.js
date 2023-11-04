const User = require('../models/userModel');
const category = require('../models/categoryModel'); 
const coupon = require('../models/couponModel'); 
const product = require('../models/productModel'); 
const admin = require('../models/adminModel'); 
const order = require('../models/orderModel'); 
const ExcelJS = require("exceljs");


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
      console.log("Reached loadhome");
      if (req.session.admin_id) {
         console.log("Reached inside if");
         const type = req.query.type; 
         console.log('type:', type);

         if(req.xhr){
         const getDataByTimeFrame = async (timeFrame) => {
            console.log("timeFrame   ====>>>>  ",timeFrame);
            let time  = timeFrame ? timeFrame : 'monthly'
            console.log("time   ====>>>>  ",time);
            try {
                let start, end;
        
                const today = new Date();
                if (time === 'daily') {
                    start = new Date(today);
                    end = new Date(today);
                    start.setHours(0, 0, 0, 0); 
                    end.setHours(23, 59, 59, 999);
                    console.log('start:', start);
                    console.log('end:', end);

                } else if (time === 'weekly') {
                    start = new Date(today);
                    start.setDate(start.getDate() - (start.getDay() + 1) % 7);
                    start.setHours(0, 0, 0, 0);
                    end = new Date(start);
                    end.setDate(end.getDate() + 6);
                    end.setHours(23, 59, 59, 999);
                    console.log('start:', start);
                    console.log('end:', end);

                } else if (time === 'monthly') {
                    start = new Date(today.getFullYear(), today.getMonth(), 1); 
                    end = new Date(today.getFullYear(), today.getMonth() + 1, 0); 
                    end.setHours(23, 59, 59, 999);
                    console.log('start:', start);
                    console.log('end:', end);

                  } else if (time === 'yearly') {
                     start = new Date(2020, 0, 1); 
                     end = new Date(2027, 11, 31); 
                     end.setHours(23, 59, 59, 999);
                     console.log('start:', start);
                     console.log('end:', end);
                     
                }
        
                const data = await order.find({
                    created_on_For_Sales_Report: {
                        $gte: start,
                        $lte: end
                    }
                });

                console.log('start:', start);
                console.log('end:', end);
                console.log('data.length :', data.length );
        
        
                return data;
            } catch (error) {
                console.error("Error:", error.message);
                throw error;
            }
        };
        
        getDataByTimeFrame(type)
               .then((result) => {
                  let orderCount = {};
                if (type === 'daily') {

                  orderCount = {
                      0 : 0, 1 : 0, 2 : 0, 3 : 0, 4 : 0, 5 : 0, 6 : 0,
                      7 : 0, 8 : 0, 9 : 0, 10 : 0,11 : 0, 12 : 0, 13 : 0, 14 : 0, 15 : 0,
                      16 : 0, 17 : 0, 18 : 0, 19 : 0, 20 : 0, 21 : 0, 22 : 0, 23 : 0, 
                  }

               } else if (type === 'weekly') {

                  orderCount= {
                     Sun : 0,
                     Mon : 0,
                     Tue : 0,
                     Wed : 0,
                     Thu : 0,
                     Fri : 0,
                     Sat : 0,
                  }

               } else if (type === 'monthly') {

                  orderCount = {
                     Jan: 0,
                     Feb: 0,
                     Mar: 0,
                     Apr: 0,
                     May: 0,
                     Jun: 0,
                     Jul: 0,
                     Aug: 0,
                     Sep: 0,
                     Oct: 0,
                     Nov: 0,
                     Dec: 0,
                 };
         

               } else if (type === 'yearly') {

                  orderCount = {
                     2020: 0,
                     2021: 0,
                     2022: 0,
                     2023: 0,
                     2024: 0,
                     2025: 0,
                     2026: 0,
                     2027: 0,
                 };

               }
               let hour;
               let day;
               let month;
               let year;
               result.forEach(order => {
                  const orderDate = order.created_on_For_Sales_Report;
                  if (type === 'daily') {
                     hour = orderDate.getHours();
                      orderCount[hour.toString()]++;
                  } else if (type === 'weekly') {
                     day = orderDate.toLocaleString('en-US', { weekday: 'short' });
                      orderCount[day]++;
                  } else if (type === 'monthly') {
                     month = orderDate.toLocaleString('en-US', { month: 'short' });
                      orderCount[month]++;
                  } else if (type === 'yearly') {
                     year = orderDate.getFullYear();
                      orderCount[year.toString()]++;
                  }
                  console.log('hour:', hour);
                  console.log('day:', day);
                  console.log('month:', month);
                  console.log('year:', year);
    
              });
                    
              console.log('Monthly order count:', orderCount);
              console.log('hour:', hour);
              console.log('day:', day);
              console.log('month:', month);
              console.log('year:', year);
      
               // console.log('Monthly order count:', result)
               console.log('type:', type);
               console.log('result.length:', result.length);
               console.log('orderCount.length:', orderCount.length);
   
               return res.json({ orderCount: orderCount})
   
                })
            .catch((error) => {
                // Handle the error
                console.error('Error:', error);
            });
        

         }else{
            return res.render('home');
         }
      } else {
         console.log("Reached inside else");
         return res.redirect('/admin');
      }
   } catch (error) {
      console.log(error.message);
   }
};

const logout = async (req, res) => {
   try {
      req.session.admin_id = null;
      res.redirect('/admin')
   } catch (error) {
      console.log(error.message)
   }
}

const chart = async (req, res) => {
   try {
            // Get the current year
            const currentYear = new Date().getFullYear();
            console.log("Reached inside the fetch in load home ");

           const orders = await order.find({})
           const months = orders.map((order) => order.created_on_For_Sales_Report.getMonth() + 1); // Adding 1 to convert 0-indexed month to a normal month number
           const totalAmounts = orders.map((order) => order.total_amount);
           const visitors = orders.map((data) => data.visitors);
           const products = orders.map((data) => data.products);
           console.log("months  ==> ",months);
           console.log("sales  ==> ",totalAmounts);
         
           // Send the extracted data to the client-side
           res.json({ months, totalAmounts});
             

   } catch (error) {
      console.log(error.message)
   }
}

const coupons = async (req, res) => {
   const itemsPerPage = 10;
   const page = parseInt(req.query.page) || 1;

   try {
       const skipCount = (page - 1) * itemsPerPage;
       const totalOrders = await coupon.countDocuments({});
       const totalPages = Math.ceil(totalOrders / itemsPerPage);
       const err = req.query.err;
       const msg = req.query.msg;
       console.log(typeof err);
       const couponData = await coupon
       .find({})
       .skip(skipCount)
       .limit(itemsPerPage)

       console.log("couponData  ==> ",couponData);
       console.log("totalOrders  ==> ",totalOrders);
       console.log("totalPages  ==> ",totalPages);
       console.log("page  ==> ",page);
 
       
       if (req.xhr) {
           res.json({ coupons: couponData, totalPages: totalPages, page: page });
       } else {
           if (err) {
               res.render('coupons', { coupons: couponData, message: '', errMessage: msg, totalPages: totalPages, page: page });
           } else {
               res.render('coupons', { coupons: couponData, message: msg, errMessage: '', totalPages: totalPages, page: page });
           }
       }
   } catch (error) {
       console.log(error.message);
   }
}


const createCoupon = async (req, res) => {
   console.log("Reached createCoupon");
   try {
      const { coupon_id, limit, minimum_Amount, maximum_Discount, discount_Percentage } = req.body;

      const newCoupon = new coupon({
          coupon_id,
          limit,
          minimum_Amount,
          maximum_Discount,
          discount_Percentage
      });

      await newCoupon.save();

      res.redirect(`/admin/coupons?err=${""}&msg=Coupon created successfully`);
  } catch (error) {
      console.error(error);
      res.redirect(`/admin/coupons?err=${true}&msg=Failed to create coupon`);
  }
}

const editCoupon = async (req, res) => {
   console.log("Reached editCoupon");
   try {
      const couponId = req.params.id;
      const {
        coupon_id,
        limit,
        expiry_Date,
        minimum_Amount,
        maximum_Discount,
        discount_Percentage,
      } = req.body;
  
      const updatedCoupon = await coupon.findByIdAndUpdate(
        couponId,
        {
          coupon_id,
          limit,
          expiry_Date,
          minimum_Amount,
          maximum_Discount,
          discount_Percentage,
        },
        { new: true } 
      );
  
      if (!updatedCoupon) {
        return res.status(404).json({ message: 'Coupon not found' });
      }
  
      if(updatedCoupon){
         res.redirect(`/admin/coupons?err=${""}&msg=Coupon updated successfully`);
      }else{
         res.redirect(`/admin/coupons?err=${true}&msg=Coupon not found`);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
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

const toggleBlockStatusCoupons = async (req, res) => {
   try {
      console.log("Reached toggleBlockStatusCoupons");
      const couponId = req.params.couponId;
      const blockStatus = req.body.blocked;

    
      const couponData = await coupon.findById(couponId);
      console.log("couponId ===> ",couponId);
      console.log("couponData.valid ===> ",couponData.valid);
      console.log("blockStatus ===> ",blockStatus);

    
      if (!couponData) {
        return res.status(404).json({ message: 'Coupon not found' });
      }
    
      couponData.valid = blockStatus; 
      
      await couponData.save();
      console.log("couponData.valid ===> ",couponData.valid);

    
      return res.status(200).json({blockStatus, message: 'Coupon validity updated successfully' });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  
}

const addCategories = async (req, res) => {
   console.log("Reached addCategories");

   try {
      const categoryName = req.body.categoryName;
      const categoryOffer = req.body.categoryOffer;
      const categoryMaximumDiscount = req.body.categoryMaximumDiscount;
      const categoryMinimumAmount = req.body.categoryMinimumAmount;
      const categoryExpiryDate = req.body.categoryExpiryDate;
      console.log("categoryName is ", categoryName);
      console.log("categoryOffer is ", categoryOffer);
      console.log("categoryMinimumAmount is ", categoryMinimumAmount);
      console.log("categoryMaximumDiscount is ", categoryMaximumDiscount);
      console.log("categoryExpiryDate is ", categoryExpiryDate);

      const existingCategory = await category.findOne({ name: categoryName });

      if (existingCategory) {
         res.redirect(`/admin/categories?err=${true}&msg=Category name already exists`);
      } else {
         const newCategory = new category({
            name: categoryName,
            offer_Persentage: categoryOffer,
            minimum_Amount: categoryMinimumAmount,
            maximum_Discount: categoryMaximumDiscount,
            expiry_Date: categoryExpiryDate,
         });

         const savedCategory = await newCategory.save();

         res.redirect(`/admin/categories?err=${''}&msg=Category created successfully`);
      }
   } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
   }
}

const editCategory = async (req, res) => {
   console.log("Reached editCategory");

   const categoryId = req.body.editCategoryId;
   const categoryName = req.body.editCategoryName;
   const categoryOffer = req.body.editCategoryOffer;
   const categoryMinimumAmount = req.body.editCategoryMinimumAmount;
   const categoryMaximumDiscount = req.body.editCategoryMaximumDiscount;
   const categoryExpiryDate = req.body.editCategoryExpiryDate;
   console.log("categoryName is ", categoryName);
   console.log("categoryOffer is ", categoryOffer);
   console.log("categoryMinimumAmount is ", categoryMinimumAmount);
   console.log("categoryMaximumDiscount is ", categoryMaximumDiscount);
   console.log("categoryExpiryDate is ", categoryExpiryDate);
   
   console.log("newName " + categoryName);
   console.log("categoryId " + categoryId);

   try {
      const existingCategory = await category.findOne({ name: categoryName });
  
      if (existingCategory && existingCategory._id != categoryId) {
         res.redirect(`/admin/categories?err=${true}&msg=Category name already exists`);
      } else {
         const updatedCategory = await category.findByIdAndUpdate(categoryId, {
            name: categoryName,
            offer_Persentage: categoryOffer,
            minimum_Amount: categoryMinimumAmount,
            maximum_Discount: categoryMaximumDiscount,
            expiry_Date: categoryExpiryDate,
         }, { new: true });

         console.log("Reached editCategory and finished updating the category");

         res.redirect(`/admin/categories?err=${''}&msg=Category updated successfully`);
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

const toggleActivateDeactivate = async (req, res) => {
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
  
      categoryData.offer_Blocked = blockStatus;
  
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
  console.log("Reached productsList");
  try {
    
    const itemsPerPage = 5;
    const page = parseInt(req.query.page) || 1;
    const skipCount = (page - 1) * itemsPerPage;
    
    const categories = await category.find({});
     const totalProducts = await product.countDocuments({});
     const totalPages = Math.ceil(totalProducts / itemsPerPage);

     const productData = await product
        .find({})
        .skip(skipCount)
        .limit(itemsPerPage);
     if (req.xhr) {

      console.log("inside if ajax req");
        res.json({ categories, products: productData, totalPages, page });
     } else {
        console.log("inside else normal req");
        res.render('productsList', { categories, products: productData, totalPages, page });
     }
  } catch (error) {
     console.log(error.message);
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
      const imagesData = productData.images; 

      console.log(typeof err);
      const categorieData = await category.find({});
      if (err) {
         res.render('editProducts', {products:productData, categories:categorieData, images: imagesData, message: '', errMessage: msg })
      } else {
         res.render('editProducts', {products:productData, categories:categorieData, images: imagesData, message: msg , errMessage: '' })
      }
   } catch (error) {
      console.log(error.message)
   }
}

// const updateProduct = async (req, res) => {
//    console.log("Reached updateProduct ");
//    const productId = req.query.productId;
//    console.log("productId " + productId);
//    console.log("Received JSON data:", req.body.removeImageNames);
//    const removeImageNames = req.body.removeImageNames;
//    console.log("removeImageNames :", removeImageNames);
   
//    try {
//      const existingProduct = await product.findById(productId);
//      console.log("existingProduct " + existingProduct);
     
//      if (!existingProduct) {
//         console.log("redirect to editProduct Product not found ");
//         res.redirect(`/admin/editProduct?productId=${productId}&err=${true}&msg=Product not found`);
//       }else if (req.files.length > 5) {
//       console.log("redirect to editProduct You can upload up to 3 images ");
//       res.redirect(`/admin/editProduct?productId=${productId}&err=${true}&msg=You can onlyupload upto 4 images`);
//    }

//      const {
//        product_name,
//        description,
//        regular_price,
//        sales_price,
//        size,
//        brand,
//        stock,
//        color,
//        material,
//        shipping_fee,
//        tax_rate,
//        categoryId,
//      } = req.body;

//    //   const updatedImages = existingProduct.images.filter((_, index) => !removeImageNames.includes(index));
//      const updatedImages = existingProduct.images.filter((imageName) => !removeImageNames.has(imageName));

//      existingProduct.product_name = product_name;
//      existingProduct.description = description;
//      existingProduct.categoryId = categoryId;
//      existingProduct.regular_price = regular_price;
//      existingProduct.sales_price = sales_price;
//      existingProduct.brand_name = brand;
//      existingProduct.stock = stock;
//      existingProduct.size = size;
//      existingProduct.color = color;
//      existingProduct.material = material;
//      existingProduct.shipping_fee = shipping_fee;
//      existingProduct.tax_rate = tax_rate;
//      existingProduct.images = updatedImages; 

//      await existingProduct.save();
//      console.log("redirect to editProduct Product and image updated successfully ");
//      res.redirect(`/admin/editProduct/${productId}?err=${""}&msg=Product and image updated successfully`);

//    } catch (error) {
//      console.error(error);
//      console.log("redirect to editProduct Internal server error ");
//      res.redirect(`/admin/editProduct/${productId}?err=${true}&msg=Internal server error`);
//    }
//  }

const updateProduct = async (req, res) => {
   console.log("Reached updateProduct");
   const productId = req.params.productId; // Updated to use params instead of query
   const existingProduct = await product.findById(productId);
   const removeImageIndices = req.body.removeImageIndices


// Filter out the empty strings and parse the array within the string
const parsedArray = removeImageIndices
  .filter(item => item.trim() !== '')  // Remove empty strings
  .map(item => JSON.parse(item));     // Parse the string into an array

// Log the parsed array
console.log("parsedArray  ===> ",parsedArray);

// Access and console the inner array
console.log("parsedArray[0]  ====>>> ",parsedArray[0]);



   try {
 
     if (!existingProduct) {
       return res.redirect(`/admin/editProducts?productId=${productId}&err=${true}&msg=Product not found`);
     }
 
     if (req.files.length > 4) { // Updated to check against 4 instead of 5
       return res.redirect(`/admin/editProducts?productId=${productId}&err=${true}&msg=You can only upload up to 4 images`);
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
 
    console.log("removeImageIndices  ===> ",removeImageIndices);
    console.log("parsedArray[0]  ====>>> ", parsedArray[0]);

    const updatedImages = existingProduct.images.filter((imageName, index) => !parsedArray[0].includes(index));
    console.log("existingProduct.images  ===>>  ",existingProduct.images);
    console.log(" updatedImages ====>> ",updatedImages);

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
     existingProduct.images = updatedImages;
 
     const updated_Product = await existingProduct.save();
     const msg = 'Product and image updated successfully';
     return res.json({ msg, updated_Product });
     //  return res.redirect(`/admin/editProducts?productId=${productId}&err=${''}&msg=Product and image updated successfully`);
   } catch (error) {
     console.error(error);
     return res.redirect(`/admin/editProducts?productId=${productId}&err=${true}&msg=Internal server error`);
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
      const userData = await User.find({});
      console.log("users "+userData);
         res.render('userList', {users:userData})
   } catch (error) {
      console.log(error.message)
   }
}

const downloadReport = async (req, res) => {
   try {
      const orders = await order
        .find({})
        .populate('user_id', 'first_name last_name email')
        .select('_id total_amount order_status created_on user_display_order_id shipping_charge discount payment_method');

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Orders');

      worksheet.columns = [
        { header: 'Order ID', key: 'orderID', width: 30 },
        { header: 'Name', key: 'name', width: 30 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Total', key: 'total', width: 30 },
        { header: 'Status', key: 'status', width: 30 },
        { header: 'Date', key: 'date', width: 30 },
        { header: 'Payment Method', key: 'paymentMethod', width: 30 },
      ];

      orders.forEach(order => {
        worksheet.addRow({
          orderID: order.user_display_order_id || order._id,
          name: `${order.user_id.first_name} ${order.user_id.last_name}`,
          email: order.user_id.email,
          total: `$${((order.total_amount + order.shipping_charge) - order.discount) || (order.total_amount + order.shipping_charge)}`,
          status: order.order_status,
          date: order.created_on,
          paymentMethod: order.payment_method,
        });
      });

      res.setHeader(
         "Content-Type",
         "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      res.setHeader(
         "Content-Disposition",
         "attachment;filename=" + "SalesReport.xlsx"
      );

      await workbook.xlsx.write(res);
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
}

const salesReport = async (req, res) => {
   const itemsPerPage = 10;
   const page = parseInt(req.query.page) || 1;
   const i = 1;

   try {
      const skipCount = (page - 1) * itemsPerPage;
      const totalOrders = await order.countDocuments({});
      const totalPages = Math.ceil(totalOrders / itemsPerPage);

      const orders = await order
         .find({})
         .skip(skipCount)
         .limit(itemsPerPage)
         .populate('user_id', 'first_name last_name email')
         .select('_id total_amount order_status created_on user_display_order_id shipping_charge discount payment_method') // Include payment_method
         console.log("orders after reverse ===>>> ", orders);

      if (req.xhr) {
         console.log("skipCount in ajax", skipCount);
         console.log("itemsPerPage in ajax ", itemsPerPage);
         console.log("orders.user_display_order_id  ===>>>  ", orders.user_display_order_id);

         res.json({ orders, totalPages, page, i });
      } else {
         console.log("itemsPerPage in normal rendering ", itemsPerPage);

         res.render('report', { orders, totalPages, page, i });
      }
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
}

const orderList = async (req, res) => {
   const itemsPerPage = 10;
   const page = parseInt(req.query.page) || 1;
   const i =1;

   try {
      const skipCount = (page - 1) * itemsPerPage;
      const totalOrders = await order.countDocuments({});
      const totalPages = Math.ceil(totalOrders / itemsPerPage);

      const orders = await order
      .find({})
      .skip(skipCount)
      .limit(itemsPerPage)
      .populate('user_id', 'first_name last_name email')
      .select('_id total_amount order_status created_on user_display_order_id shipping_charge discount')
      // .sort({ created_on: 1 });
      // console.log("orders before reverse ===>>> ",orders);
      // orders.reverse();
      console.log("orders after reverse ===>>> ",orders);


      if (req.xhr) {
         console.log("skipCount in ajax",skipCount);
         console.log("itemsPerPage in ajax ",itemsPerPage);
         console.log("orders.user_display_order_id  ===>>>  ",orders.user_display_order_id);


         res.json({ orders, totalPages, page, i });
      } else {
         console.log("itemsPerPage in normal rendering ",itemsPerPage);


         res.render('orderList',{orders,totalPages, page, i});
      }
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
}


const orders = async (req, res) => {
   const itemsPerPage = 10;
   const page = parseInt(req.query.page);

   try {
       const skipCount = (page - 1) * itemsPerPage;
       const totalOrders = await order.countDocuments({});
       const totalPages = Math.ceil(totalOrders / itemsPerPage);

       const ordersData = await order
           .find({})
           .skip(skipCount)
           .limit(itemsPerPage)
           .populate('user_id', 'first_name last_name email')
           .select('_id total_amount order_status created_on user_display_order_id')
           .sort({ created_on: -1 });

           console.log("ordersData.user_display_order_id  ===>>>  ",ordersData.user_display_order_id);

       res.json({ orders: ordersData, totalPages, page });
   } catch (error) {
       console.error(error);
       res.status(500).json({ error: 'Internal Server Error' });
   }
}


const ordersDetail = async (req, res) => {
   console.log("Reached ordersDetail");
   try {
      const orderId = req.params.orderId;

      const orderData = await order.findById(orderId)
        .populate({
          path: 'user_id',
          model: User,
          select: 'first_name last_name email mobile address',
        })
        .populate({
          path: 'items.product_id',
          model: product,
          select: 'product_name regular_price sales_price images',
        })
        .exec();

      if (!orderData) {
        return res.status(404).send('Order not found');
      }
      console.log("orderData : ",orderData);
      const currentOrderStatus = orderData.order_status;
      res.render('ordersDetail', { order: orderData, currentOrderStatus });
   } catch (error) {
      console.log(error.message);
      res.status(500).send('Internal Server Error');
   }
}

const updateOrderStatus = async (req, res) => {
   try {
       console.log("Reached updateOrderStatus");
       const { orderId, selectedStatus } = req.body;
       console.log("orderId, selectedStatus : ", orderId, selectedStatus);

       if (selectedStatus === 'Request Approved') {
           const Order = await order.findById(orderId).populate('items.product_id');
           const OrderDetails = await order.findByIdAndUpdate(orderId, { payment_status: 'Refunded' });
           console.log("OrderDetails   ====>>>>  ",OrderDetails);
           if (!Order) {
               return res.status(404).json({ success: false, message: 'Order not found' });
           }

           if(OrderDetails.return_Reason != "Defective"){
            console.log("OrderDetails.return_Reason  ===>>>  ",OrderDetails.return_Reason);
               for (const item of Order.items) {
                  const Product = item.product_id;
                  const quantityToIncrease = item.quantity;

                  await product.findByIdAndUpdate(Product, { $inc: { stock: quantityToIncrease } });

            }
           }

           const user = await User.findById(OrderDetails.user_id).populate('transaction');
           const totalAmount = OrderDetails.total_amount;
           await User.findByIdAndUpdate(OrderDetails.user_id, { $inc: { wallet_Balance: totalAmount } });
           const newTransaction = {
            type: 'Credit',
            amount: OrderDetails.total_amount,
            date: new Date(),
          };

          function generateRandomString() {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let randomString = '';
         
            for (let i = 0; i < 25; i++) {
              const randomIndex = Math.floor(Math.random() * characters.length);
              randomString += characters.charAt(randomIndex);
            }
         
            return randomString;
         }

          const user_display_order_id = generateRandomString();
          newTransaction.user_display_order_id = user_display_order_id;


          user.transaction.push(newTransaction);

          console.log("user.transaction[-1] ====>>>  ",user.transaction[-1]);

         await user.save();

         }

       if (selectedStatus == "Delivered") {
         const deliveredDate = function () {
           const now = new Date();
           const day = now.getDate().toString().padStart(2, '0');
           const month = (now.getMonth() + 1).toString().padStart(2, '0');
           const year = now.getFullYear().toString();
           return `${day}-${month}-${year}`;
         };
         const formattedDate = deliveredDate();
         console.log("deliveredDate  ====>>> ", formattedDate);
         const updated = await order.findByIdAndUpdate(orderId, {
           order_status: selectedStatus,
           delivered_on: formattedDate,
           payment_status: "Paid"
         });
         console.log("updated  ====>>> ", updated);
       } else {
         await order.findByIdAndUpdate(orderId, { order_status: selectedStatus });
       }

       res.json({ success: true, message: 'Order status updated successfully' });
   } catch (error) {
       console.error(error);
       res.status(500).json({ success: false, message: 'Error updating order status' });
   }
};


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
   orders,
   ordersDetail,
   updateOrderStatus,
   coupons,
   createCoupon,
   editCoupon,
   toggleBlockStatusCoupons,
   toggleActivateDeactivate,
   salesReport,
   downloadReport,
   chart,
}

