import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { fetchMyIssues } from "../graphql/Queries";
import UserHome from "../pages/UserHome";
import { io } from "socket.io-client";
import { useMutation } from "@apollo/client/react";
import { DeleteIssue } from "../graphql/Mutations";

export const ISSUE_CATEGORIES = [
  { category: "Water" },
  { category: "Waste" },
  { category: "Roads" },
  { category: "Pollution" },
];

export const ISSUE_STATUS = [
  { id: 1, status: "open" },
  { id: 2, status: "in_progress" },
  { id: 3, status: "resolved" },
];

const IssuesSection = ({ issues, title, loading, error }) => {
  const [value, setValue] = useState("");
  const [data, setData] = useState([]);
  const [dataToMap, setDataToMap] = useState([]);
  const [deleteIssue] = useMutation(DeleteIssue);
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    if (!issues) return;

    if (pathname === "/admin") {
      setData(issues.allIssues ?? []);
    } else {
      setData(issues.myIssues ?? []);
    }
  }, [issues, pathname]);

  //Preserving the OG data
  useEffect(() => {
    setDataToMap(data);
  }, [data]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("issue_created", (issue) => {
      console.log(issue);
      setDataToMap((prev) => {
        console.log("prev:", prev, Array.isArray(prev));
        return [issue, ...prev];
      });
    });

    socket.on("issue_removed", (issueId) => {
      console.log(dataToMap);
      setDataToMap((prev) => prev.filter((value) => value.id !== issueId));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  function makeFirstletterCapital(value) {
    const firstLetter = value[0];
    const splitValue = value.split(firstLetter);
    const firstLetterCapital = firstLetter.toUpperCase();

    return firstLetterCapital + splitValue[1];
  }

  function handleStateChange(id, value) {
    setData((prev) =>
      prev.map((issue) =>
        issue.id == id ? { ...issue, status: value } : issue
      )
    );
  }

  //Only Admin
  async function handleUpdateStatus(id, status) {
    console.log(id, status);

    const { error } = await supabase
      .from("issues")
      .update({ status })
      .eq("id", id);
    UserHome;

    if (error) {
      console.error(error);
      return;
    }
  }

  const handleFilter = (value) => {
    const valueLowered = value.toLowerCase();

    const filteredData =
      value != ""
        ? dataToMap.filter((val) => val.category === valueLowered)
        : data;
    setDataToMap(filteredData);
  };

  const handleDeleteIssue = async (id) => {
    console.log(id);
    const { data } = await deleteIssue({
      variables: {
        id,
      },
    });

    console.log(data);
  };

  return (
    <section className="flex flex-col items-center gap-5 mt-4 mb-80">
      {/* Heading */}
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-4xl">{title}</h1>
        <div className=" border-2 border-teal-700"></div>
      </div>

      {/* Search + filtering(Delayed) */}
      <div className="flex flex-row justify-end min-w-[80vw] gap-3 mt-7">
        {/* Searchbox */}
        {/* <div className="flex flex-row gap-3">
          <input
            placeholder="Search your issues"
            className="border min-w-[50vw] rounded px-4 py-2 text-white caret-white placeholder:opacity-80 placeholder:text-white/50 bg-teal-800 focus:outline-none focus:ring-0 focus:border-transparent"
          />
          <button className="bg-teal-800 rounded-xl w-full cursor-pointer py-1 px-3 text-white font-semibold text-lg">
            Search
          </button>
        </div> */}

        {/* Filtering */}
        <div className=" rounded-lg flex flex-row gap-1">
          <select
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              handleFilter(e.target.value);
            }}
            className="border rounded px-3 py-2 focus:outline-none"
          >
            <option value="" hidden>
              Select a category
            </option>

            {ISSUE_CATEGORIES.map((cat) => (
              <option key={cat.category} value={cat.category}>
                {cat.category}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              handleFilter("");
              setValue("");
            }}
            className="bg-teal-900 text-white font-lg py-1 px-2 rounded hover:bg-red-600/90 transition currsor-pointer ease-in"
          >
            Remove filters
          </button>
        </div>
      </div>

      {error && (
        <div className="text-2xl font-bold text-gray-600 animate-pulse">
          Some Error Occurred..
        </div>
      )}

      {loading && (
        <div className="text-2xl font-bold text-gray-600 animate-pulse">
          Loading Data...
        </div>
      )}

      {/* Complaints */}
      {!loading && data.length == 0 && (
        <p className="text-2xl font-bold text-gray-600 animate-pulse">
          No entries found
        </p>
      )}

      {data.length > 0 && (
        <div className="grid w-[80vw] lg:grid-cols-3 gap-3 md:grid-cols-1 grid-cols-1">
          {dataToMap?.map((issue, index) => {
            const category = makeFirstletterCapital(issue.category);
            const status =
              issue.status == "open"
                ? "Open"
                : issue.status == "in_progress"
                ? "InProgress"
                : "Resolved";
            return (
              <div
                className="p-8 rounded-lg flex flex-col border border-gray-400 gap-5 shadow-lg"
                style={{ "--i": index }}
                key={issue.id}
              >
                {/* 1st row */}
                <div className="flex flex-row justify-around">
                  <h4 className="italic text-grey-500 font-semibold text-md">
                    Issue #{index + 1}
                  </h4>

                  <button
                    onClick={() => {
                      handleDeleteIssue(issue.id);
                    }}
                    className="bg-red-700 text-white font-lg py-1 px-2 rounded hover:bg-red-600/90 transition currsor-pointer ease-in"
                  >
                    Delete Issue
                  </button>
                </div>

                <div className="border border-gray-400 mb-5"></div>

                {/* 2nd Row */}
                <div className="flex flex-row justify-around">
                  <h3
                    className={`${
                      issue.category === "water"
                        ? "bg-blue-500"
                        : issue.category === "waste"
                        ? "bg-green-500"
                        : issue.category === "pollution"
                        ? "bg-indigo-500"
                        : "bg-gray-500"
                    } py-1 px-3 text-white rounded-md`}
                  >
                    {category}
                  </h3>
                  <h3
                    className={`${
                      status === "Open"
                        ? "bg-red-500"
                        : status === "InProgress"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    } py-1 px-3 text-white rounded-md`}
                  >
                    {status}
                  </h3>
                </div>

                {/* 3rd row */}
                <div className="flex flex-row justify-around">
                  <h3 className="py-1 px-3">
                    <span className="text-teal-700 font-bold">Latitude: </span>
                    {issue.latitude}
                  </h3>
                  <h3 className="py-1 px-3">
                    <span className="text-teal-700 font-bold">Longitude: </span>
                    {issue.longitude}
                  </h3>
                  <h3 className="py-1 px-3">
                    <span className="text-teal-700 font-bold">Area: </span>
                    {issue.area}, {issue.city}
                  </h3>
                </div>

                {/* 4th row */}
                <p className="italic text-center text-xl font-semibold">
                  "{issue.description}"
                </p>

                {/* 5th row */}
                <p className="text-gray-600 text-end">{issue.user?.name}</p>

                {pathname == "/admin" && (
                  <div>
                    {/* Divider */}
                    <div className="border border-gray-400 mb-5"></div>

                    {/* Status Selector */}
                    <div className="flex flex-col gap-3 items-center w-full">
                      <div className=" rounded-lg flex flex-row gap-1">
                        <select
                          value={issue.status}
                          onChange={(e) => {
                            handleStateChange(issue.id, e.target.value);
                          }}
                          className="border rounded px-3 py-2 focus:outline-none"
                        >
                          <option value="" hidden>
                            Select a category
                          </option>

                          {ISSUE_STATUS.map((s) => (
                            <option key={s.id} value={s.status}>
                              {s.status}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={() => {
                            handleUpdateStatus(issue.id, issue.status);
                          }}
                          className="bg-teal-900 text-white font-lg py-1 px-2 rounded hover:bg-red-600/90 transition currsor-pointer ease-in"
                        >
                          Update Status
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default IssuesSection;
