import { View,Text,TextInput,TouchableOpacity,Image,StyleSheet,} from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {widthPercentageToDP as wp,heightPercentageToDP as hp,} from "react-native-responsive-screen";

export default function RecipesFormScreen({ route, navigation }) {
  const { recipeToEdit, recipeIndex, onrecipeEdited } = route.params || {};
  const [recipeName, setrecipeName] = useState(recipeToEdit ? recipeToEdit.recipeName : "");
  const [recipeImage, setrecipeImage] = useState(recipeToEdit ? recipeToEdit.recipeImage : "");
  const [ingredientName, setingredientName] = useState(recipeToEdit ? recipeToEdit.ingredientName : "");
  const [measure, setmeasure] = useState(recipeToEdit ? recipeToEdit.measure : "");
  const [cookingDescription, setcookingDescription] = useState(
    recipeToEdit ? recipeToEdit.cookingDescription : ""
  );

  const saverecipe = async () => {
    const newrecipe = {recipeName, recipeImage, ingredientName, measure, cookingDescription };
    try {
      const existingrecipes = await AsyncStorage.getItem("customrecipes");
      const recipes = existingrecipes ? JSON.parse(existingrecipes) : [];

      // If editing an article, update it; otherwise, add a new one
      if (recipeToEdit !== undefined) {
        recipes[recipeIndex] = newrecipe;
        await AsyncStorage.setItem("customrecipes", JSON.stringify(recipes));
        if (onrecipeEdited) onrecipeEdited(); // Notify the edit
      } else {
        recipes.push(newrecipe); // Add new article
        await AsyncStorage.setItem("customrecipes", JSON.stringify(recipes));
      }

      //navigation.goBack(); // Return to the previous screen
      navigation.navigate("Home"); // Navigate to MyFood screen
    } catch (error) {
      console.error("Error saving the recipe:", error); 
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="recipeName"
        value={recipeName}
        onChangeText={setrecipeName}
        style={styles.input}
      />
      <TextInput
        placeholder="Image URL"
        value={recipeImage}
        onChangeText={setrecipeImage}
        style={styles.input}
      />
      {recipeImage ? (
        <Image source={{ uri: recipeImage }} style={styles.image} />
      ) : (
        <Text style={styles.imagePlaceholder}>Upload Image URL</Text>
      )}
      <TextInput
        placeholder="ingredientName"
        value={ingredientName}
        onChangeText={setingredientName}
        style={styles.input}
      />
      <TextInput
        placeholder="measure"
        value={measure}
        onChangeText={setmeasure}
        style={styles.input}
      />
      <TextInput
        placeholder="cookingDescription"
        value={cookingDescription}
        onChangeText={setcookingDescription}
        multiline={true}
        numberOfLines={4}
        style={[styles.input, { height: hp(20), textAlignVertical: "top" }]}
      />
      <TouchableOpacity onPress={saverecipe} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save recipe</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(4),
  },
  input: {
    marginTop: hp(4),
    borderWidth: 1,
    borderColor: "#ddd",
    padding: wp(.5),
    marginVertical: hp(1),
  },
  image: {
    width: 300,
    height:200,
    margin: wp(2),
  },
  imagePlaceholder: {
    height: hp(20),
    justifyContent: "center",
    alignItems: "center",
    marginVertical: hp(1),
    borderWidth: 1,
    borderColor: "#ddd",
    textAlign: "center",
    padding: wp(2),
  },
  saveButton: {
    backgroundColor: "#4F75FF",
    padding: wp(.5),
    alignItems: "center",
    borderRadius: 5,
    marginTop: hp(2),
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
