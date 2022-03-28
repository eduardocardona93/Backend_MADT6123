import { StyleSheet, Text, View,FlatList,TouchableOpacity,Alert  } from 'react-native'
import React, { useState,useContext }  from 'react'
import { createCategory,updateCategory,getAllCategories,removeCategory } from '../services/BackendServices';
import { Ionicons} from '@expo/vector-icons';
import MangoStyles from '../styles'
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';

import Prompt from 'react-native-prompt-crossplatform';
const CategoriesScreen = ({navigation,route}) => {
    const { user } = useContext(AuthenticatedUserContext);
    const [categories, categoriesSet] = useState([]);

    const [promptVisible,promptVisibleSet] = useState(false)
    const [promptText,promptTextSet] = useState('')
    const [selectedCategory,selectedCategorySet] = useState(null);
    
    const selectCategory =  (item) =>{
        navigation.navigate('HomeScreen', {catId:item._id});
    }
    const editCategory = async(item) =>{
      await selectedCategorySet(item)
        await promptTextSet(item.name)
        promptVisibleSet(true)
    }
    const deleteCategory = async (item) =>{
        await selectedCategorySet(item)
        showAlert(item);
    }
    const showAlert = (category) =>
      {  Alert.alert( "Delete Category?", "Do you want to delete this category?",
        [
          {
            text: "Cancel",onPress: () => {},style: "cancel",},
          {
            text: "Delete",
            onPress: () => {
                removeCategory(category._id)
                .then(()=>{
                  updateCategoryList()
                })
                .catch(e =>{
                  console.log(e)
                })


            },
            style: "cancel",
          },
        ],
        {
          cancelable: true,
        }
      )};
      React.useLayoutEffect(() => {
        navigation.setOptions({
          headerLeft: () => ( user && user.isAdmin   ?
            <TouchableOpacity onPress={() => {
                selectedCategorySet(null)
                promptVisibleSet(true)
                promptTextSet('')
              }
            }>
              <Text style={styles.searchBtn}>
                <Ionicons name='add' size={24} color='white' />
              </Text>
            </TouchableOpacity> : <View />
          ),
        });
      })
      React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          updateCategoryList();
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
      }, [navigation]);

      const updateCategoryList = () => {
        getAllCategories()
        .then(categoriesFound => {
          categoriesSet(categoriesFound)
        }).catch(e => {
          console.log(e)
        })
      }



    return (
      
        <View style ={styles.container}>

            <Prompt
                title=  {selectedCategory && selectedCategory.name ?   "Rename Category" :"Add Category"}
                inputPlaceholder={"Type a name"}
                defaultValue={selectedCategory && selectedCategory.name ?  selectedCategory.name :""}
                isVisible={promptVisible}
                onChangeText={(text) => {
                    promptTextSet(text)
                }}
                onCancel={() => {promptVisibleSet(false)}}
                onSubmit={() => {
                    if(promptText && promptText !== ''){
                        if(selectedCategory && selectedCategory.name){
                            updateCategory({'name': promptText,...selectedCategory})
                        }else{
                            createCategory(promptText)
                        }
                        promptVisibleSet(false);
                        updateCategoryList();
                    }
                }}
            />
          <FlatList
            data={categories}
            renderItem={({cat,item,index}) => {
                return (
                <View style={[styles.item,{backgroundColor: index%2 ===0 ? 'lightgray': MangoStyles.mangoPaleOrange}]} key={item._id} >
                    <TouchableOpacity onPress={() => {selectCategory(item)}} style={[styles.titleCont , { width : user &&  user.isAdmin? '60%' : '100%'}]}>
                        <Text style={[styles.title]}>{item.name}</Text>      
                    </TouchableOpacity>
                    {(user &&  user.isAdmin ? 
                        <TouchableOpacity onPress={() => {editCategory(item)}} style={[styles.editBtn]}>
                              <Text style={[styles.title]}>
                                <Ionicons name='pencil' size={24} color='white' />
                            </Text>
                             </TouchableOpacity>   : <View/> ) }
                    {(user &&  user.isAdmin ?        <TouchableOpacity onPress={() => {deleteCategory(item)}} style={[styles.deleteBtn]}>
                            <Text style={[styles.title]}>
                                <Ionicons name='trash' size={24} color='white' />
                            </Text>
                        </TouchableOpacity>
                      : <View/> ) }

                    
                    
                </View>

            )
            }}
            keyExtractor={item => item._id}
          />
        </View>
        
    )
}

export default CategoriesScreen

const styles = StyleSheet.create({
    container: {
        fontSize: 18,
        flex: 1,
        backgroundColor: MangoStyles.mangoPaleOrange,
        paddingHorizontal: 0,
        paddingTop:10,
  
      },
      title:{
        fontSize: 25
      },
      titleCont:{
        padding:10
      },
      item:{
        flexDirection : 'row',
        paddingHorizontal: 5,
        paddingVertical:10
    },
    searchBtn: {
      marginHorizontal: 10,
      padding: 5
    },
    editBtn:{
        width: '15%',
        backgroundColor: MangoStyles.mangoPositiveAction,
        padding: 15,
        marginHorizontal: 10,
        borderRadius: 5
    },
    deleteBtn:{
        width: '15%',
        backgroundColor: MangoStyles.mangoNegativeAction,
        padding: 15,
        marginHorizontal: 5,
        borderRadius: 5
    },
})