import { useParams } from "react-router-dom";

export default function UserDetailPage() {
  const { id } = useParams();
  return <div>User Detail: {id}</div>;
}
