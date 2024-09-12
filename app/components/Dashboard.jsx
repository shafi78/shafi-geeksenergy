"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [movieVotes, setMovieVotes] = useState({});
  const [activeMenu, setActiveMenu] = useState("Movies"); // State to manage active menu option

  const handleUpvote = (movieId) => {
    setMovieVotes((prevVotes) => ({
      ...prevVotes,
      [movieId]: (prevVotes[movieId] || 0) + 1,
    }));
  };

  const handleDownvote = (movieId) => {
    setMovieVotes((prevVotes) => ({
      ...prevVotes,
      [movieId]: (prevVotes[movieId] || 0) - 1,
    }));
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    setMovieVotes((prevVotes) =>
      movies.reduce((acc, movie) => {
        acc[movie.id] = movie.totalVoted || 0;
        return acc;
      }, {})
    );
  }, [movies]);

  const fetchMovies = async () => {
    setIsLoading(true);
    const response = await fetch("https://hoblist.com/api/movieList", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        category: "movies",
        language: "kannada",
        genre: "all",
        sort: "voting",
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("data:", JSON.stringify(data, null, 2));
      setMovies(data.result);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      console.error("Failed to fetch movies");
    }
  };

  const handleMenuClick = (option) => {
    setActiveMenu(option);
  };

  return (
    <div className="container mx-auto mt-10">
      {/* Menu Bar */}
      <div className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="space-x-4">
          <button
            className={`hover:underline ${
              activeMenu === "Movies" ? "text-blue-500" : ""
            }`}
            onClick={() => handleMenuClick("Movies")}
          >
            Movies
          </button>
          <button
            className={`hover:underline ${
              activeMenu === "Company Info" ? "text-blue-500" : ""
            }`}
            onClick={() => handleMenuClick("Company Info")}
          >
            Company Info
          </button>
        </div>
      </div>

      {/* Conditional Rendering */}
      {activeMenu === "Company Info" ? (
        <div className="mt-10 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Company Information</h2>
          <p className="text-gray-700">
            <strong>Company:</strong> Geeksynergy Technologies Pvt Ltd
          </p>
          <p className="text-gray-700">
            <strong>Address:</strong> Sanjayanagar, Bengaluru-56
          </p>
          <p className="text-gray-700">
            <strong>Phone:</strong> XXXXXXXXX09
          </p>
          <p className="text-gray-700">
            <strong>Email:</strong> XXXXXX@gmail.com
          </p>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-bold mb-6 mt-10 text-center">
            Movie List
          </h1>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            movies.map((movie) => (
              <div
                key={movie._id}
                className="bg-white p-4 rounded-lg shadow-md mb-6 flex items-start space-x-4"
              >
                {/* upvote and downvote */}
                <div className="flex flex-col items-center space-y-2">
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => handleUpvote(movie.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  </button>
                  <p className="font-bold text-xl">
                    {movie.totalVoted || movieVotes[movie.id]}
                  </p>
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => handleDownvote(movie.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <p className="text-xs text-gray-500">Votes</p>
                </div>

                <div className="flex-1">
                  <div className="flex items-start space-x-4">
                    <Image
                      src={movie.poster}
                      alt={movie.title}
                      width={100}
                      height={100}
                      className="rounded-lg"
                    />
                    <div>
                      <h2 className="font-bold text-lg">{movie.title}</h2>
                      <p className="text-gray-600 text-sm">
                        Genre: {movie.genre}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Director: {movie.director}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Starring: {movie.stars}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        Mins | {movie.language} |{" "}
                        {new Date(
                          movie.releasedDate * 1000
                        ).toLocaleDateString()}
                      </p>
                      <p className="text-blue-500 text-xs mt-1">
                        {movie.pageViews} views | Voted by {movie.totalVoted}{" "}
                        People
                      </p>
                    </div>
                  </div>

                  <button className="mt-4 bg-blue-500 w-full text-white px-4 py-2 rounded-md hover:bg-blue-600">
                    Watch Trailer
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
