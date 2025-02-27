import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Activity } from '../../types/activity';
import { format } from 'date-fns';

interface ActivityDetailPageProps {
  activity: Activity;
  pageNumber: number;
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  metadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    flexWrap: 'wrap',
  },
  metadataItem: {
    fontSize: 10,
    color: '#666',
    marginRight: 15,
  },
  type: {
    fontSize: 12,
    color: '#444',
    backgroundColor: '#f5f5f5',
    padding: 5,
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  content: {
    marginTop: 20,
    fontSize: 12,
    lineHeight: 1.6,
  },
  reportSection: {
    marginTop: 15,
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  reportContent: {
    fontSize: 12,
    lineHeight: 1.6,
    // Note: HTML content from TinyMCE will need to be sanitized and converted to plain text
    whiteSpace: 'pre-wrap',
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
  timestamps: {
    marginTop: 20,
    fontSize: 10,
    color: '#666',
  },
});

export const ActivityDetailPage = ({ activity, pageNumber }: ActivityDetailPageProps) => {
  // Function to sanitize HTML content from TinyMCE
  const sanitizeHtml = (html: string) => {
    // Remove HTML tags and decode entities
    return html
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
      .replace(/&amp;/g, '&') // Replace &amp; with &
      .replace(/&lt;/g, '<') // Replace &lt; with <
      .replace(/&gt;/g, '>') // Replace &gt; with >
      .replace(/&quot;/g, '"') // Replace &quot; with "
      .trim();
  };

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>{activity.title}</Text>
        <Text style={styles.type}>{activity.type}</Text>
        
        <View style={styles.metadata}>
          <Text style={styles.metadataItem}>
            Date: {format(new Date(activity.activityDate), 'MMMM dd, yyyy')}
          </Text>
          <Text style={styles.metadataItem}>
            Last Modified: {format(new Date(activity.lastModified), 'MMM dd, yyyy HH:mm')}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.reportSection}>
          <Text style={styles.reportTitle}>Activity Report</Text>
          <Text style={styles.reportContent}>
            {sanitizeHtml(activity.report)}
          </Text>
        </View>

        <View style={styles.timestamps}>
          <Text>Created: {format(new Date(activity.createdAt), 'MMMM dd, yyyy HH:mm')}</Text>
          <Text>Updated: {format(new Date(activity.updatedAt), 'MMMM dd, yyyy HH:mm')}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text>Page {pageNumber}</Text>
      </View>
    </Page>
  );
};