import { ScrollView, Text, TextInput, View } from "react-native";
import { Search } from "lucide-react";
import MyLoc from "../components/myLoc";
import MyFav from "../components/myFav";

export default function HomeScreen() {
    return (
        <View>
            <Text>Météo</Text>
            <Text>Vos villes en un coup d'œil</Text>
            <View>
                <Search />
                <TextInput placeholder="Rechercher une ville" />
            </View>
            <MyLoc />
            <Text>VILLES FAVORITES</Text>
            <ScrollView>
                <MyFav />
                <MyFav />
                <MyFav />
                <MyFav />
            </ScrollView>
        </View>
    );
}