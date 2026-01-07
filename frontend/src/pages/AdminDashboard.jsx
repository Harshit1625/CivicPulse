
import IssuesSection from "../components/IssuesSection";
import Navbar from "../components/Navbar";
import { issues } from "../utils/dummyData";
import { useQuery } from "@apollo/client/react";
import { fetchAllIssues } from "../graphql/Queries";

const AdminDashboard = () => {
  const { data, loading, error } = useQuery(fetchAllIssues);
  return (
    <div>
      <Navbar>
        <div className="mt-12">
          <IssuesSection title="All Complaints" loading={loading} error={error} issues={data} />
        </div>
      </Navbar>
    </div>
  );
};

export default AdminDashboard;
