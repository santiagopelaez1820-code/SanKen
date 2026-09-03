import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ChallengeMetric, ChallengeType } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAdminStore } from '@/store/admin-store';
import { Skeleton } from '@/components/ui/skeleton';

const TYPE_OPTIONS: { value: ChallengeType; label: string }[] = [
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensual' },
];

const METRIC_OPTIONS: { value: ChallengeMetric; label: string }[] = [
  { value: 'workouts_count', label: 'Cantidad de entrenamientos' },
  { value: 'total_volume_kg', label: 'Volumen total (kg)' },
];

export default function AdminRetosScreen() {
  const theme = useTheme();
  const {
    challengeTemplates,
    isLoadingChallengeTemplates,
    challengeTemplateError,
    loadChallengeTemplates,
    createChallengeTemplate,
    toggleChallengeTemplateActive,
  } = useAdminStore();

  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ChallengeType>('weekly');
  const [metric, setMetric] = useState<ChallengeMetric>('workouts_count');
  const [target, setTarget] = useState('');

  useEffect(() => {
    loadChallengeTemplates();
  }, [loadChallengeTemplates]);

  const canSubmit = code.trim() && title.trim() && description.trim() && target.trim();

  const submit = async () => {
    if (!canSubmit) return;
    await createChallengeTemplate({ code, title, description, type, metric, target: Number(target) });
    setCode('');
    setTitle('');
    setDescription('');
    setTarget('');
  };

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.four }]}>
          <ThemedText type="title" style={styles.pageTitle}>
            Retos
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Cada plantilla activa genera un reto nuevo cada semana o mes. Agregar una métrica distinta a las ya
            listadas todavía requiere desarrollo.
          </ThemedText>

          <ThemedView type="backgroundElement" style={styles.card}>
            <ThemedText type="smallBold">Nueva plantilla</ThemedText>
            <TextInput
              value={code}
              onChangeText={setCode}
              placeholder="Código único (ej. weekly_5_sessions)"
              placeholderTextColor={theme.textSecondary}
              autoCapitalize="none"
              style={[styles.input, { borderColor: theme.backgroundSelected, color: theme.text }]}
            />
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Título"
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { borderColor: theme.backgroundSelected, color: theme.text }]}
            />
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Descripción"
              placeholderTextColor={theme.textSecondary}
              multiline
              style={[styles.input, { borderColor: theme.backgroundSelected, color: theme.text }]}
            />

            <ThemedText type="small" themeColor="textSecondary">
              Cadencia
            </ThemedText>
            <View style={styles.chipsRow}>
              {TYPE_OPTIONS.map((option) => {
                const selected = option.value === type;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => setType(option.value)}
                    style={[
                      styles.chip,
                      { borderColor: selected ? theme.accent : theme.backgroundSelected },
                      selected && { backgroundColor: theme.backgroundSelected },
                    ]}>
                    <ThemedText type="small" themeColor={selected ? 'text' : 'textSecondary'}>
                      {option.label}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>

            <ThemedText type="small" themeColor="textSecondary">
              Métrica
            </ThemedText>
            <View style={styles.chipsRow}>
              {METRIC_OPTIONS.map((option) => {
                const selected = option.value === metric;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => setMetric(option.value)}
                    style={[
                      styles.chip,
                      { borderColor: selected ? theme.accent : theme.backgroundSelected },
                      selected && { backgroundColor: theme.backgroundSelected },
                    ]}>
                    <ThemedText type="small" themeColor={selected ? 'text' : 'textSecondary'}>
                      {option.label}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>

            <TextInput
              value={target}
              onChangeText={setTarget}
              placeholder="Objetivo"
              placeholderTextColor={theme.textSecondary}
              keyboardType="numeric"
              style={[styles.input, { borderColor: theme.backgroundSelected, color: theme.text }]}
            />

            {challengeTemplateError && (
              <ThemedText type="small" style={styles.error}>
                {challengeTemplateError}
              </ThemedText>
            )}

            <PrimaryButton label="Crear plantilla" onPress={submit} disabled={!canSubmit} />
          </ThemedView>

          {isLoadingChallengeTemplates && (
            <Skeleton height={56} borderRadius={Spacing.three} />
          )}

          {challengeTemplates.map((template) => (
            <ThemedView key={template.id} type="backgroundElement" style={styles.card}>
              <ThemedText type="smallBold">
                {template.title} <ThemedText type="small" themeColor="textSecondary">({template.code})</ThemedText>
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {template.description}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {TYPE_OPTIONS.find((o) => o.value === template.type)?.label} ·{' '}
                {METRIC_OPTIONS.find((o) => o.value === template.metric)?.label} · objetivo {template.target}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {template.is_active ? 'Activa' : 'Inactiva'}
              </ThemedText>
              <PrimaryButton
                label={template.is_active ? 'Desactivar' : 'Activar'}
                variant="ghost"
                onPress={() => toggleChallengeTemplateActive(template.id, template.is_active)}
              />
            </ThemedView>
          ))}

          <PrimaryButton label="Volver" variant="ghost" onPress={() => router.back()} />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1, alignItems: 'center', width: '100%' },
  scrollView: { alignSelf: 'stretch' },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.three,
  },
  pageTitle: { fontSize: 28, lineHeight: 34 },
  card: { borderRadius: Spacing.four, padding: Spacing.three, gap: Spacing.two },
  input: { borderWidth: 1, borderRadius: Spacing.two, paddingHorizontal: Spacing.two, paddingVertical: Spacing.two },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  chip: { borderWidth: 1, borderRadius: Spacing.two, paddingVertical: Spacing.one, paddingHorizontal: Spacing.two },
  error: { color: '#FF4D5E' },
});
