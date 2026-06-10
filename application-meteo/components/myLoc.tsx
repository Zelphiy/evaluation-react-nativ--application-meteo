import { View, Text } from "react-native";
import { MapPin } from "lucide-react";

export default function MyLoc() {
    return (
        <View>
            <View>
                <MapPin />
                <Text>Ma position</Text>
            </View>
            <Text>Ville, Pays</Text>
            <View>
                <View>
                    <Text>Température</Text>
                    <Text>Conditions météorologiques</Text>
                    <Text>Ressenti: température</Text>
                </View>
                <View>
                    <Text>Icon relative au temps</Text>
                </View>
            </View>
            <View>
                <Text>Température min</Text>
                <Text>Température max</Text>
            </View>
        </View>
    );
}