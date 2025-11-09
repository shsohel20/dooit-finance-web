export default function DashboardPageWrapper({
  children,
  title = "Dashboard",
}) {
  return (
    <div>
      <div className="border-b bg-gray border-gray-200 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-medium leading-6 text-gray-900 sm:truncate">
            {title}
          </h1>
        </div>
      </div>
      <div className="border-b bg-white border-gray-200 px-4 py-6 h-screen">
        {children}
      </div>
    </div>
  );
}
