import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Activity } from '../../types/activity';
import { format } from 'date-fns';

interface TableOfContentsProps {
  activities: Activity[];
  startPage: number;
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  contentItem: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  activityTitle: {
    flex: 1,
    fontSize: 12,
  },
  pageNumber: {
    fontSize: 12,
    marginLeft: 10,
  },
  dots: {
    borderBottomWidth: 1,
    borderBottomColor: '#999',
    borderBottomStyle: 'dotted',
    flex: 1,
    marginHorizontal: 5,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 10,
    color: '#666',
    marginLeft: 15,
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

export const TableOfContents = ({ activities, startPage }: TableOfContentsProps) => {
  // Group activities by type
  const groupedActivities = activities.reduce((acc, activity) => {
    if (!acc[activity.type]) {
      acc[activity.type] = [];
    }
    acc[activity.type].push(activity);
    return acc;
  }, {} as Record<string, Activity[]>);

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Table of Contents</Text>
      </View>

      {Object.entries(groupedActivities).map(([type, typeActivities], typeIndex) => (
        <View key={type}>
          <Text style={styles.sectionHeader}>{type}</Text>
          {typeActivities.map((activity, index) => (
            <View key={activity._id} style={styles.contentItem}>
              <Text style={styles.activityTitle}>
                {activity.title}
                <Text style={styles.dateText}>
                  {format(new Date(activity.activityDate), 'MMM dd, yyyy')}
                </Text>
              </Text>
              <View style={styles.dots} />
              <Text style={styles.pageNumber}>
                {startPage + typeIndex + index}
              </Text>
            </View>
          ))}
        </View>
      ))}

      <View style={styles.footer}>
        <Text>Page 2</Text>
      </View>
    </Page>
  );
};