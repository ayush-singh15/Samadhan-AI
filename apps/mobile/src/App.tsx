import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { HomeScreen } from './screens/HomeScreen';
import { SubmitProblemScreen } from './screens/SubmitProblemScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'submit'>('home');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🇮🇳 Samadhan AI Mobile</Text>
        <Text style={styles.headerSubtitle}>Citizen Field Reporting</Text>
      </View>

      <View style={styles.content}>
        {activeTab === 'home' ? <HomeScreen /> : <SubmitProblemScreen />}
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'home' && styles.tabActive]}
          onPress={() => setActiveTab('home')}
        >
          <Text style={styles.tabText}>📋 Feed</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'submit' && styles.tabActive]}
          onPress={() => setActiveTab('submit')}
        >
          <Text style={styles.tabText}>📸 Report Problem</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    backgroundColor: '#1e293b',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#38bdf8',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    backgroundColor: '#1e293b',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  tabActive: {
    borderTopWidth: 2,
    borderTopColor: '#6366f1',
    backgroundColor: '#334155',
  },
  tabText: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '600',
  },
});
