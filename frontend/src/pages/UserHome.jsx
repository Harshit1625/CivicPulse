import Dialog from "../components/Dialog";
import IssuesSection from "../components/IssuesSection";
import Navbar from "../components/Navbar";
import { fetchMyIssues } from "../graphql/Queries";
import { issues } from "../utils/dummyData";
import { civicQuotes } from "../utils/quotes";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { CreateIssue } from "../graphql/Mutations";

//Optimisation : Index changes component re-renders.

const UserHome = () => {
  const [index, setIndex] = useState(0);
  const length = civicQuotes.length;
  const [open, setOpen] = useState(false);
  const { data, loading, error } = useQuery(fetchMyIssues);
  const [createIssue] = useMutation(CreateIssue);
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    if (data) {
      setIssues(data);
    }
  }, [data]);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % length);
    }, 5000);

    console.log(index);
    return () => clearInterval(id);
  }, [length]);

  async function handleSubmittedIssue(form) {
    await createIssue({
      variables: {
        category: form.category,
        description: form.description,
        longitude: form.longitude,
        latitude: form.latitude,
        area: form.area,
        city: form.city,
      },
    });
  }

  return (
    <>
      <Navbar>
        <div className="flex flex-col lg:flex-row items-center gap-8 px-6 py-12 overflow-hidden">
          {/* div1 - image */}
          <div className="w-full lg:w-1/2 flex items-center justify-center">
            <img
              src="/main.jpg"
              alt="Quote visual"
              className="max-w-2xl h-auto rounded-lg object-cover"
            />
          </div>

          {/* div2 - content */}
          <div
            key={index}
            className="w-full lg:w-1/2 flex flex-col lg:items-start items-center"
          >
            {/* Quotes Section */}
            {/* Quotes Logo + text */}
            <div className="flex flex-row gap-3 justify-center lg:justify-normal quotesAnimate">
              <div className="flex justify-center">
                <img
                  src="/quotesLogo.png"
                  alt="Quote visual"
                  className="h-10 rounded-lg object-cover"
                />
              </div>
              <h1 className="quotes text-gray-900 lg:text-4xl md:text-3xl w-3/4 font-bold leading-snug">
                {civicQuotes[index].quote}
              </h1>
            </div>

            {/* Other Quotes Things */}
            <h2 className="mt-4 lg:text-2xl italic md:text-2xl w-3/4 justify-end text-gray-600 text-right quotesAnimate">
              — {civicQuotes[index].author}
            </h2>

            <button
              onClick={() => setOpen(true)}
              className="mt-8 inline-flex items-center lg:ml-9 gap-2 px-6 py-3 bg-teal-900 text-white rounded-md hover:bg-teal-800 cursor-pointer transition"
            >
              Raise your complaint +
            </button>
          </div>
        </div>

        {/* Dialog */}
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          onSubmit={handleSubmittedIssue}
        />

        {/* Issues */}
        <IssuesSection
          title="My Complaints"
          loading={loading}
          error={error}
          issues={issues}
        />
      </Navbar>
    </>
  );
};

export default UserHome;
