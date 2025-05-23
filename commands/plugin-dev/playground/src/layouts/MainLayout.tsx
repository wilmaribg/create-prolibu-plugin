export const MainLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-2xl">Plugin Playground wilmar</h1>
      </header>
      <main className="flex-1 p-4">
        <div className="container mx-auto">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci
          amet nisi sequi culpa officiis velit eaque accusamus aut possimus,
          porro aspernatur quisquam consequatur similique iure explicabo
          molestiae quae, eos voluptatibus?
        </div>
      </main>
      <footer className="bg-gray-800 text-white p-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2023 Plugin Playground. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
