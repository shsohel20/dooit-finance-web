import { getMyAssignments } from "@/app/dashboard/client/knowledge-hub/training-hub/actions";

const TrainingTab = () => {
  const [modules, setModules] = useState([]);

  const fetchTrainingModules = async () => {
    try {
      const response = await getMyAssignments();
      const data = await response.json();
      setModules(data);
    } catch (error) {
      console.error("Error fetching training modules:", error);
    }
  };
  useEffect(() => {
    fetchTrainingModules();
  }, []);
  return (
    <div>
      <h1>Training Tab</h1>
      <p>This is the training tab content.</p>
    </div>
  );
};

export default TrainingTab;
