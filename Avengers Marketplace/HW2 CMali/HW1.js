const minimist  = require('minimist')
const { Table } = require ('console-table-printer')
const fs = require('fs')
const { clear } = require('console')

//invokes fs const to read users.json file
function readUsers(){
   
    let inputFile = fs.readFileSync('users.json').toString() 
    if (inputFile.length===0){
        fs.writeFileSync('users.json',JSON.stringify([],null,2))
        inputFile = fs.readFileSync('users.json')
    }
    let users =JSON.parse(inputFile)
    return users
}

// Handles Writes out to users.json file
function writeUsers(users){
    let JSONstr =JSON.stringify(users)
    fs.writeFileSync('users.json',JSONstr)
}

//Handles the addition of users to the file, also checks if username is unique
function addUser(args){
    let users = readUsers()
    let user  = {}
    let existingUserName  = false                        //boolean variable to check username uniqueness
                               
    user.name = args.name

    for(let i = 0; i<users.length; i++){                                     //loop to traverse users in file usernames
        if(users[i].userName === args.userName){
            console.log("This username is already taken. Please choose a different one.")
            existingUserName=true
         }
            else {
            existingUserName = false
         }
    }
    
    
    if(existingUserName === false){                 //checks boolean variable to assign users username and name to file
        user.userName = args.userName
        user.name = args.name

        if (args.balance === undefined) {            //checks if balance was input if not sets user to default value
            args.balance = 100
        }

        user.balance = args.balance                     //assigns default balance
        user.items = []
        users.push(user)
        writeUsers(users)
        viewUsers()
    }

}

//removes user from file
function deleteUser(){
    let users = readUsers()
    let user ={}
    console.log("Deleting User")

    for(let user of users){                     //loop to traverse users for specific username to delete user
        if(user.username === args.username){    //if user is found user is deleted
            users.splice(i,1)
            writeUsers(users)
            viewUsers()
        }else{
            console.log("User doesn't exist")
            viewUsers()
        }
    }  
}


//Handles addition of user items
function addItem(args) {

    let users = readUsers()
    let user = {}
    let item = {}
    user.item = args.name
    user.id = Math.floor(Math.random() * 101)                       //Assigns random ID to item
    user.username = args.owner
    user.price = args.price
    item.name = user.item
    item.price = user.price
    item.id = user.id
    for (let i = 0; i < users.length; i++) {                   //loops to traverse users length
        if (users[i].username === args.owner) {               // checks for username at each position to find the one the item should be added to
            users[i].items.push(item)                       //adds item to the designated username list
        }
    }
  
    writeUsers(users)
    viewUsers()
    viewProducts()
}


//function handles the purchasing of items
function buyItem(args) {

    let users = readUsers()
    let user = {}

    let buyerID = -1                                                    //variable used to locate buyer

    for (let i = 0; i < users.length; i++) {                          //loops through users for buyerID validation                    
        if (users[i].userName === args.buyer) {
            buyerID = i

        }
    }

    if (buyerID === -1) {
        console.log('invalid buyer ID')
        return
    }

    for (let i = 0; i < users[buyerID].items.length; i++) {
        if (users[buyerID].items[i].id === args.id) {                //Check if item is already in buyers possesion
            console.log("This Item already belongs to user")
            return

        }
    }


    let sellerID = -1               //variable used for item accusition
    let itemindex = -1              //variable used for item accusition


    for (let i = 0; i < users.length; i++) {                                  //loop to traverse users legnth
        for (let j = 0; j < users[i].items.length; j++) {                     //loop to traverse items              
            if (users[i].items[j].id === args.id) {                          // compares if id of item is inserted
                sellerID = i                                                //sets seller id to know who has item
                itemindex = j                                               //sets index to know where item is


            }
        }

    }
    
    console.log(sellerID)
    //console.log(itemid)

    if (sellerID === -1) {
        console.log("Item does not exist!")
        return
    }

    if (users[buyerID].balance < users[sellerID].items[itemindex].price) {               // checks if users balance is less than cost of item
        console.log("Insufficient funds!")
        return
    }


    console.log("Transaction Sucessfull!")
    users[buyerID].balance -= users[sellerID].items[itemindex].price            //equation for subtracting buyes balance
    users[sellerID].balance += users[sellerID].items[itemindex].price           //equation for adding price to seller balance
    users[buyerID].items.push(users[sellerID].items[itemindex])                 //places item into buyers item
    users[sellerID].items.splice(itemindex, 1)                                   //removes item from sellers list
   
    writeUsers(users)
    viewUsers()
    viewProducts()
}

//handles the viewing of users in file
function viewUsers(){       

    //const variable for table form output
    const userstable = new Table({
        columns: [
          { name: "username", alignment: "left"}, 
          { name: "name", alignment: "left" },
          { name: "balance", alignment:"left" },
          { name: "Items for Sale",alignment:"right"}
        ]
      })  
     
      let users = readUsers()
     for(user of users){
        userstable.addRow({username: user.userName, name: user.name, balance: "$"+ user.balance, "Items for Sale": user.items.length})       //adds username, balance and number of items columns
     }
     console.log("--User Log--")
     userstable.printTable()
}

//handles the viewing of products in user file
function viewProducts(){            
    
    //const variable for product table form output
    const product = new Table({
        columns: [
          { name: "id", alignment: "left"}, 
          { name: "name", alignment: "left" },
          { name: "seller", alignment:"left" },
          { name: "price",alignment:"right"}
        ]
      })  
     
    let users = readUsers()
    
    //loop to traverse through users and a nested loop to obtain their items
    for(user of users){
        for (items of user.items){
            product.addRow({id: items.id, name: items.name, seller: user.username, price: "$" + items.price})       //adds product id, name, seller and price columns
        }
     }
     console.log("--Product Log--")
     product.printTable()
}

//invokes minimist functionality
let args = minimist(process.argv.slice(2),{})

//set of conditional statements to call specific functions based on user input
if('addUser' in args){
    addUser(args)
   
} else if('view' in args){

    if('all' === args.view){
        viewUsers()
        viewProducts()
    } else if('users' === args.view){
        viewUsers()
    }else if('products' === args.view){
        viewProducts()
    }
} else if('addItem' in args){
    addItem(args)
}else if('buy'in args){
    buyItem(args)
} else if('delete' in args){
    deleteUser(args)
} else{
    console.log("Invalid Command")
}
    
module.exports = {
    addUser,
    buyItem
}