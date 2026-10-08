// Esta línea sirve para importar «ScrollView, StyleSheet» desde «react-native».
import { ScrollView, StyleSheet } from 'react-native';
// Esta línea sirve para importar «Lock, Trophy» desde «lucide-react-native».
import { Lock, Trophy } from 'lucide-react-native';
// Esta línea sirve para importar los tipos «Achievement» desde «@sanken/core».
import type { Achievement } from '@sanken/core';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «Icon» desde «@/components/ui/icon».
import { Icon } from '@/components/ui/icon';
// Esta línea sirve para importar «Spacing» desde «@/constants/theme».
import { Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';

// Esta línea sirve para declarar la interfaz «AchievementsRowProps».
interface AchievementsRowProps {
  // Esta línea sirve para declarar la propiedad «achievements» con el valor o tipo «Achievement[]».
  achievements: Achievement[];
}

// Esta línea sirve para declarar la función «AchievementsRow».
export function AchievementsRow({ achievements }: AchievementsRowProps) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para extraer «nlockedCoun» de «achievements.filter((a) => a.unlocked).l».
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView type="backgroundElement" style={styles.card}>
      {/* Esta línea sirve para abrir el componente «ThemedView». */}
      <ThemedView style={styles.header}>
        {/* Esta línea sirve para mostrar el texto «Logros» dentro de «ThemedText». */}
        <ThemedText type="smallBold">Logros</ThemedText>
        {/* Esta línea sirve para mostrar el bloque solo si «achievements.length > 0». */}
        {achievements.length > 0 && (
          // Esta línea sirve para abrir el componente «ThemedText».
          <ThemedText type="smallBold" style={{ color: theme.accent }}>
            {/* Esta línea sirve para mostrar el contenido dinámico «{unlockedCount}/{achievements.length}». */}
            {unlockedCount}/{achievements.length}
          </ThemedText>
        )}
      </ThemedView>

      {/* Esta línea sirve para elegir entre dos bloques según «achievements.length === 0». */}
      {achievements.length === 0 ? (
        // Esta línea sirve para abrir el componente «ThemedText».
        <ThemedText type="small" themeColor="textSecondary">
          {/* Esta línea sirve para mostrar el texto «Todavía no hay logros disponibles.». */}
          Todavía no hay logros disponibles.
        </ThemedText>
      // Esta línea sirve para mostrar el bloque alternativo.
      ) : (
        // Esta línea sirve para abrir el componente «ScrollView».
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
          {/* Esta línea sirve para recorrer «achievements» y mostrar un bloque por elemento. */}
          {achievements.map((achievement) => (
            // Esta línea sirve para abrir el elemento «ThemedView» con sus atributos en varias líneas.
            <ThemedView
              // Esta línea sirve para identificar el elemento de la lista con «achievement.code}».
              key={achievement.code}
              // Esta línea sirve para pasar la propiedad «style» con el valor «[».
              style={[
                // Esta línea sirve para agregar el estilo «styles.badge».
                styles.badge,
                // Esta línea sirve para agregar un elemento cuyo «borderColor» es «achievement.unlocked ? theme.accent : th…».
                { borderColor: achievement.unlocked ? theme.accent : theme.backgroundSelected },
                // Esta línea sirve para atenuar el logro si está bloqueado.
                !achievement.unlocked && styles.locked,
              ]}>
              {/* Esta línea sirve para abrir el elemento «Icon» con sus atributos en varias líneas. */}
              <Icon
                // Esta línea sirve para pasar la propiedad «icon» con el valor «achievement.unlocked ? Trophy : Lock}».
                icon={achievement.unlocked ? Trophy : Lock}
                // Esta línea sirve para pasar la propiedad «size» con el valor «20}».
                size={20}
                // Esta línea sirve para pasar la propiedad «color» con el valor «achievement.unlocked ? theme.accent : theme.t».
                color={achievement.unlocked ? theme.accent : theme.textSecondary}
              />
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="small" style={styles.name} numberOfLines={1}>
                {/* Esta línea sirve para mostrar el valor «achievement.name». */}
                {achievement.name}
              </ThemedText>
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="small" themeColor="textSecondary">
                {/* Esta línea sirve para mostrar el contenido dinámico «+{achievement.xp_bonus} XP». */}
                +{achievement.xp_bonus} XP
              </ThemedText>
            </ThemedView>
          ))}
        </ScrollView>
      )}
    </ThemedView>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «card» con el valor o tipo «{».
  card: {
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.four».
    borderRadius: Spacing.four,
    // Esta línea sirve para declarar la propiedad «padding» con el valor o tipo «Spacing.three».
    padding: Spacing.three,
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
  },
  // Esta línea sirve para declarar la propiedad «header» con el valor o tipo «{».
  header: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'space-between'».
    justifyContent: 'space-between',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
  // Esta línea sirve para declarar la propiedad «row» con el valor o tipo «{».
  row: {
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
  },
  // Esta línea sirve para declarar la propiedad «badge» con el valor o tipo «{».
  badge: {
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «96».
    width: 96,
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.half».
    gap: Spacing.half,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.three».
    borderRadius: Spacing.three,
    // Esta línea sirve para declarar la propiedad «borderWidth» con el valor o tipo «1».
    borderWidth: 1,
    // Esta línea sirve para declarar la propiedad «paddingVertical» con el valor o tipo «Spacing.two + 2».
    paddingVertical: Spacing.two + 2,
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.one».
    paddingHorizontal: Spacing.one,
  },
  // Esta línea sirve para declarar la propiedad «locked» con el valor o tipo «{».
  locked: {
    // Esta línea sirve para declarar la propiedad «opacity» con el valor o tipo «0.5».
    opacity: 0.5,
  },
  // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «{».
  name: {
    // Esta línea sirve para declarar la propiedad «textAlign» con el valor o tipo «'center'».
    textAlign: 'center',
  },
});
