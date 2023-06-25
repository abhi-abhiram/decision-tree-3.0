import Layout from "~/components/ui/Layout";
import Sidebar from "~/components/data-model/Sidebar";

export default function DataModel() {
  return (
    <Layout>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1"></div>
      </div>
    </Layout>
  );
}
