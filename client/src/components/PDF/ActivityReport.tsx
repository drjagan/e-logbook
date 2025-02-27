import { Document, StyleSheet } from '@react-pdf/renderer';
import { Activity } from '../../types/activity';
import { CoverPage } from './CoverPage';
import { TableOfContents } from './TableOfContents';
import { ActivityDetailPage } from './ActivityDetailPage';

interface ActivityReportProps {
  activities: Activity[];
  dateRange: {
    startDate: string;
    endDate: string;
  };
  residentName: string;
  type?: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
});

export const ActivityReport = ({ 
  activities, 
  dateRange, 
  residentName,
  type 
}: ActivityReportProps) => {
  // Calculate the starting page number for activities
  // Page 1: Cover Page
  // Page 2: Table of Contents
  // Page 3+: Activity Details
  const activityStartPage = 3;

  return (
    <Document>
      {/* Cover Page */}
      <CoverPage
        residentName={residentName}
        dateRange={dateRange}
        totalActivities={activities.length}
      />

      {/* Table of Contents */}
      <TableOfContents
        activities={activities}
        startPage={activityStartPage}
      />

      {/* Activity Detail Pages */}
      {activities.map((activity, index) => (
        <ActivityDetailPage
          key={activity._id}
          activity={activity}
          pageNumber={activityStartPage + index}
        />
      ))}
    </Document>
  );
};