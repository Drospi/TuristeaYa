import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import type { PlaceMapProps } from './place-map.types';
import { colors, radius } from '@/theme';

export function PlaceMap({ point, title, height = 220 }: PlaceMapProps) {
  return (
    <View style={{ height, borderRadius: radius.md, overflow: 'hidden', borderWidth: 1, borderColor: colors.border }}>
      <MapView key={`${point.latitude},${point.longitude}`} style={StyleSheet.absoluteFill}
        initialRegion={{ ...point, latitudeDelta: 0.008, longitudeDelta: 0.008 }}
        accessibilityLabel={`Mapa de ${title}`} loadingEnabled>
        <Marker coordinate={point} title={title} pinColor={colors.primary} />
      </MapView>
    </View>
  );
}
