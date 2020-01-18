import React, {useState, useEffect} from "react"
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity} from "react-native"
import MapView, {Marker, Callout} from "react-native-maps"
import {requestPermissionsAsync, getCurrentPositionAsync} from "expo-location"
import {MaterialIcons} from "@expo/vector-icons"

import api from "./services/api"
import {connect, disconnect, subscribeToNewDevs} from "./services/socket"

function Main({ navigation }){
    var [devs, setDevs] = useState([])
    var [currentRegion, setCurrentRegion] = useState(null)
    var [techs, setTechs] = useState('')
    
    useEffect(() => {
        async function loadInitialPosition(){
           var {granted} = await requestPermissionsAsync()
        
        if (granted){
            var {coords} = await getCurrentPositionAsync({
                enableHighAccuracy: true
            })
       
            var {latitude, longitude} = coords 
      
        setCurrentRegion({
           latitude,
           longitude,
           latitudeDelta: 0.04 ,
           longitudeDelta: 0.04,
       })
    
        }
        }
    loadInitialPosition()
    }, [])
    
    useEffect(() => {
        subscribeToNewDevs(dev => setDevs([...devs, dev]))
    }, [devs])
    function setupWebSocket(){
        disconnect()
        
        var { latitude, longitude} = currentRegion
        
        connect(
            latitude,
            longitude,
            techs  
        )
    }

    async function loadDevs(){
        var {latitude, longitude} = currentRegion
    
        var response = await api.get("/search",{
            params: {
                latitude,
                longitude,
                techs: techs
            }
        })
    
        setDevs(response.data)
        setupWebSocket()
    
    }

    function handleRegionChanged(region){
        setCurrentRegion(region)
    }
    

    if (!currentRegion){
        return null 
    }
    
    return (
    <>
    <MapView 
    onRegionChangeComplete={handleRegionChanged}  
    initialRegion = {currentRegion} 
    style = {styles.map}
    >
    {devs.map(dev => (
       <Marker key={dev._id} coordinate = {{ latitude: dev.location.coordinate[1], longitude: dev.location.coordinate[0]}}>
       <Image style={styles.avatar} source={{ uri: dev.avatar_url }}/>
   <Callout onPress={() => {
       navigation.navigate("Profile", { github_user: dev.github_user})
   }}>
       <View style={styles.callout}>
<Text style={styles.devName}>{dev.name}</Text>
<Text style={styles.devBio}>{dev.bio}</Text>
<Text style={styles.devTechs}>{dev.techs.join(", ")}</Text>
       </View>
   </Callout>
   </Marker> 
    ))}
    </MapView>
    <View style = {styles.searchForm}>
        <TextInput style={styles.searchInput}
            placeholder="Buscar Devs por Techs..."
            placeholderTextColor="#999"
            autoCapitalize="words"
            autoCorrect={false}
            value = {techs}
            onChangeText = {setTechs}
        />
    <TouchableOpacity onPress={loadDevs} style={styles.loadButton}>
        <MaterialIcons name= "my-location" size = {20} color = "#FFF"/>
    </TouchableOpacity>
    </View>
    </>
    
        )
    }
 
var styles = StyleSheet.create({
    map: {
        flex: 1
    },
    avatar: {
        width: 54,
        height: 54,
        borderRadius: 4,
        borderWidth: 4,
        borderColor: "#FFF"
    }, 
    callout: {
        width: 260,
    },
    devName :{
        fontWeight: "bold",
        fontSize: 16,    
    },
    devBio : {
        color: "#666",
        marginTop: 5
    },
    devTechs: {
        marginTop: 5
    },
    searchForm: {
        position : "absolute",
        top: 20,
        left: 20,
        right: 20,
        zIndex: 5,
        flexDirection: "row"
    },
    searchInput: {
        flex: 1,
        height: 50,
        backgroundColor: "#FFF",
        color: "#333",
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 4,
            height: 4,
        },
        elevation: 2,
    },

    loadButton: {
        width: 50,
        height: 50,
        backgroundColor: "#000",
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 15,
    }
})

export default Main;
