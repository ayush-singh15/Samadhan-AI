import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';

export const HomeScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Nearby Reported Issues</Text>

      <View style={styles.card}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>WATER_SANITATION</Text>
        </View>
        <Text style={styles.cardTitle}>Contaminated Drinking Water Tank</Text>
        <Text style={styles.cardSubtitle}>Ward 4, Rampur Village • Lucknow</Text>
        <Text style={styles.status}>Status: Assigned to IIT Kanpur</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>AGRICULTURE</Text>
        </View>
        <Text style={styles.cardTitle}>Lack of Solar Cold Storage</Text>
        <Text style={styles.cardSubtitle}>Kisan Mandi • Varanasi</Text>
        <Text style={styles.status}>Status: Under AI Categorization</Text>
      </View>
    </ScrollView>
  );
};

export const SubmitProblemScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Quick Citizen Report</Text>
      <Text style={styles.infoText}>Tap to capture geotagged photo evidence with live GPS coordinates.</Text>

      <TouchableOpacity style={styles.cameraBox}>
        <Text style={styles.cameraIcon}>📷</Text>
        <Text style={styles.cameraText}>Take Photo / Record Video</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitBtn}>
        <Text style={styles.submitBtnText}>Submit to AI Microservice →</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#38bdf820',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  badgeText: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  status: {
    fontSize: 12,
    color: '#818cf8',
    marginTop: 8,
    fontWeight: '600',
  },
  cameraBox: {
    backgroundColor: '#1e293b',
    borderWidth: 2,
    borderColor: '#6366f1',
    borderStyle: 'dashed',
    borderRadius: 16,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  cameraIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  cameraText: {
    color: '#cbd5e1',
    fontSize: 14,
    fontWeight: '600',
  },
  submitBtn: {
    backgroundColor: '#6366f1',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
