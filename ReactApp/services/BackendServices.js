import Constants from 'expo-constants';
import uuid from 'react-native-uuid';
import moment from 'moment';
const SERVICE_URL = Constants.manifest.extra.apiUrl;

// #region Users related operations
  export const Signup = ( user) => {
    console.log(user)
    return fetch(
        SERVICE_URL + 'users/add', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              "address" : user.address,
              "email" : user.email,
              "isAdmin" : false,
              "name" : user.name,
              "password" : user.password,
              "phoneNumber" : user.phoneNumber,
          })
        }
      )
    
  }

  export const resetPassword = (to_email, email_subject, email_body) => {
    return fetch( SERVICE_URL + 'users/sendEmail',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "to_email": to_email,
          "email_subject": email_subject,
          "email_body": email_body
        })
      }
    )
    // .then(() => { res.json() })
  }
  
  export const GetUserInfo = async (emailAddress) => {
    let userInfo = null
    await  fetch(SERVICE_URL + 'users/findByEmail/'+encodeURIComponent(emailAddress))
          .then((response) => response.json())
          .then((json) => {
              userInfo = json
          })
          .catch((error) => {
            console.error(error);
          });
          

    return userInfo
  }
  export const LoginUser = async (emailAddress,password) => {
    let userInfo = null;
    await  fetch(SERVICE_URL + 'users/loginUser/'+encodeURIComponent(emailAddress)+ "?password="+password)
          .then((response) => response.json())
          .then((json) => {
              userInfo = json
          })
          .catch((error) => {
            console.error(error);
          });
          

    return userInfo
  }
  export const updateUserInfo = (user) => {
    return fetch(
      SERVICE_URL + 'users/update/'+ encodeURIComponent(user._id), {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          "address" : user.address,
          "name" : user.name,
          "phoneNumber" : user.phoneNumber,
      })
    })
  }
  export const getAllUsers = async () => {
    var users = [];
    await fetch(
        SERVICE_URL + 'users/', {method: 'GET',})
        .then((response) => response.json())
        .then(json =>{
            users = json;
        }).catch(error =>{
          console.log(error)
        })

    return users;
  }
  
  export const getUsersFiltered = async (filterTerm) => {
    // console.log("getting all users");

    var users = [];
    await fetch(
        SERVICE_URL + 'users/'+(filterTerm && filterTerm !== '' ? filterTerm : ''), {method: 'GET',})
        .then((response) => response.json())
        .then(json =>{
            users = json;
        }).catch(error =>{
          console.log(error)
        })

    return users;
  }

  // #endregion
  
  // #region Products related operations
  
  export const getAllProducts = async (category,searchTerm) => {
    var products = [];
    const search = searchTerm && searchTerm !== '' ? '&searchText='+searchTerm : ''
    await fetch(SERVICE_URL + 'products?category='+category+search, {method: 'GET',})
        .then((response) => response.json())
        .then(json =>{ products = json;})
        .catch(error =>{
          console.log(error)
        })

    return products;
  }
  export const createProduct = (product) => {
    return fetch(
        SERVICE_URL + 'products/add', {
          method: 'POST',
          headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "categoryId" : product.categoryId,
            "categoryName" : product.categoryName,
            "description" : product.description ,
            "name" : product.name,
            "price" : product.price
        })
      })
  }
  export const updateProduct = (product,productId) => {
    return fetch(
      SERVICE_URL + 'products/update/'+ encodeURIComponent(productId), {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "categoryId" : product.categoryId,
        "categoryName" : product.categoryName,
        "description" : product.description ,
        "name" : product.name,
        "price" : product.price
      })
    })
  }
  
  export const getProduct = async (id) => {
    let product = null
    await fetch(SERVICE_URL + 'products/'+ encodeURIComponent(id))
    .then((response) => response.json())
    .then(json =>{ product = json;})
    .catch(error =>{console.log(error)})
    return product
  }
  export const removeProduct = (id) => {
    return fetch(SERVICE_URL + 'products/'+ encodeURIComponent(id), {method: 'DELETE'});
  }
  
  
  // #endregion
  
  
  // #region Categories related operations
    
  export const getAllCategories = async () => {
    let categories;
    await  fetch(SERVICE_URL + 'productsCategories/')
          .then((response) => response.json())
          .then((json) => {
            categories = json;
          })
          .catch((error) => {
            console.error(error);
          });
          

    return categories
  }
  export const createCategory = (categoryName) => {
    return fetch(
      SERVICE_URL + 'productsCategories/add', {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          "name" : categoryName,
      })
    })
  }
  export const updateCategory = (category) => {
    return fetch(
      SERVICE_URL + 'productsCategories/update/'+ encodeURIComponent(category._id), {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "name" : category.name,
      })
    })
  }
  
  export const getCategory = (id) => {
    return fetch(SERVICE_URL + 'productsCategories/'+ encodeURIComponent(id));
    
  }
  export const removeCategory = (id) => {
    return fetch(SERVICE_URL + 'productsCategories/'+ encodeURIComponent(id), {method: 'DELETE'});
    
  }
  // #endregion
  
  // #region Orders related operations
  
  export const getAllOrders = async (filterOrders) => {
    var orders = [];
    await fetch(
        SERVICE_URL + 'orders/filtered/'+filterOrders, {method: 'GET',})
        .then((response) => response.json())
        .then(json =>{
          orders = json
        }).catch(error =>{
          console.log(error)
        })

    return orders;
  }

  
  export const getUserOrders = async (userID,filterOrders) => {
    var orders = [];
    await fetch(
        SERVICE_URL + 'orders/filtered/'+filterOrders+'?filterUser='+userID, {method: 'GET',})
        .then((response) => response.json())
        .then(json =>{
          orders = json
        }).catch(error =>{
          console.log(error)
        })
    return orders;  
  }
  
  
  export const getShopListDoc = async (userID) => {
   
    var shopListDoc = null;
  
    await fetch(
      SERVICE_URL + 'orders/shoppingCart/'+userID, {method: 'GET',})
      .then((response) => response.json())
      .then(json =>{
        shopListDoc = json;
      }).catch(error =>{
        console.log(error)
      })

      return shopListDoc;
  }
  
  export const addItemToShoppingCart = ( item , userID) => {
    return fetch(
      SERVICE_URL + 'orders/addToShoppingCart/', {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userID: userID,
        newItem: {...item}
      })
    })
    
  }
  
  export const removeItemShoppingCart = ( index,userID) => {
    return fetch(SERVICE_URL + 'orders/removeFromShoppingCart/'+userID.toString()+"?productIndex="+index.toString(), {method: 'DELETE'});
  }
  
  export const updateOrderState = ( orderID,newStatus) => {
    return fetch(SERVICE_URL + 'orders/changeState/'+orderID+"?newStatus="+newStatus, {method: 'PUT'});

  
  }
  // #endregion
  
  // #region sales related operations
  
  
  
  export const getSales = async (userID) => {
   
    var dataSales = null;
  
    await fetch(SERVICE_URL + 'productsInOrders/getSales')
      .then((response) => response.json())
      .then(json =>{
        dataSales = json;
      }).catch(error =>{
        console.log(error)
      })

      return dataSales;
  }

  // export const sendEmail = 

  // #endregion