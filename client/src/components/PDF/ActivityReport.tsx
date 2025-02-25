import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Activity } from '../../types/activity';
import { format } from 'date-fns';

interface ActivityReportProps {
  activities: Activity[];
  dateRange: {
    startDate: string;
    endDate: string;
  };
  type?: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  filterInfo: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  tableContainer: {
    width: '100%',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    minHeight: 30,
    alignItems: 'center',
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold',
  },
  tableCell: {
    flex: 1,
    padding: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#666',
    fontSize: 10,
  },
});

export const ActivityReport = ({ activities, dateRange, type }: ActivityReportProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Activity Report</Text>
        <Text style={styles.subtitle}>Generated on {format(new Date(), 'MMM dd, yyyy HH:mm')}</Text>
      </View>

      <View style={styles.filterInfo}>
        <Text>Date Range: {format(new Date(dateRange.startDate), 'MMM dd, yyyy')} - {format(new Date(dateRange.endDate), 'MMM dd, yyyy')}</Text>
        {type && type !== 'All' && <Text>Activity Type: {type}</Text>}
        <Text>Total Activities: {activities.length}</Text>
      </View>

      <View style={styles.tableContainer}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>Title</Text>
          <Text style={styles.tableCell}>Type</Text>
          <Text style={styles.tableCell}>Date</Text>
        </View>
        {activities.map((activity) => (
          <View key={activity._id} style={styles.tableRow}>
            <Text style={styles.tableCell}>{activity.title}</Text>
            <Text style={styles.tableCell}>{activity.type}</Text>
            <Text style={styles.tableCell}>
              {format(new Date(activity.activityDate), 'MMM dd, yyyy')}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text>E-Logbook Activity Report • Page 1</Text>
      </View>
    </Page>
  </Document>
);