import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';

interface CoverPageProps {
  residentName: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  totalActivities: number;
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff',
  },
  header: {
    marginTop: 150,
    marginBottom: 50,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  residentInfo: {
    marginTop: 50,
    textAlign: 'center',
  },
  residentName: {
    fontSize: 20,
    marginBottom: 10,
  },
  dateRange: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  activityCount: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
  },
});

export const CoverPage = ({ residentName, dateRange, totalActivities }: CoverPageProps) => (
  <Page size="A4" style={styles.page}>
    <View style={styles.header}>
      <Text style={styles.title}>E-Logbook Activity Report</Text>
      <Text style={styles.subtitle}>Comprehensive Activity Documentation</Text>
    </View>

    <View style={styles.residentInfo}>
      <Text style={styles.residentName}>{residentName}</Text>
      <Text style={styles.dateRange}>
        Period: {format(new Date(dateRange.startDate), 'MMMM dd, yyyy')} - {format(new Date(dateRange.endDate), 'MMMM dd, yyyy')}
      </Text>
      <Text style={styles.activityCount}>Total Activities: {totalActivities}</Text>
    </View>

    <View style={styles.footer}>
      <Text>Generated on {format(new Date(), 'MMMM dd, yyyy HH:mm')}</Text>
    </View>
  </Page>
);