import axios from "axios";
import { useEffect, useState } from "react";
import { MoonLoader } from "react-spinners";

const DataFetcher = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const mealsPerPage = 10; 

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    axios
      .get("https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood", {
        signal,
      })
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log("Request canceled", error.message);
        } else {
          setError(error);
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, []);

  //styles
  const styles = {
    container: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
      gap: "20px",
      margin: "20px",
    },
    card: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      gap: "10px",
      padding: "10px",
      border: "1px solid black",
      borderRadius: "10px",
    },
    img: {
      maxWidth: "100%",
      height: "auto",
    },
    loaderDiv: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: "50vh",
    },
    pagination: {
      display: "flex",
      justifyContent: "center",
      gap: "5px",
      marginTop: "20px",
    },
    button: {
      padding: "10px 20px",
      border: "1px solid black",
      borderRadius: "5px",
      cursor: "pointer",
      backgroundColor: "#f0f0f0",
    },
    activeButton: {
      backgroundColor: "#007bff",
      color: "white",
    },
    disabledButton: {
      backgroundColor: "#ccc",
      cursor: "not-allowed",
    },
    p: {
      textAlign: "center",
    },
  };

  // Pagination logic
  const indexOfLastMeal = currentPage * mealsPerPage;
  const indexOfFirstMeal = indexOfLastMeal - mealsPerPage;
  const currentMeals = data.meals?.slice(indexOfFirstMeal, indexOfLastMeal);

  const totalPages = Math.ceil((data.meals?.length || 0) / mealsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return loading ? (
    <div style={styles.loaderDiv}>
      <MoonLoader
        loading={loading}
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      <p style={styles.p}>Loading, please wait...</p>
    </div>
  ) : error ? (
    <p style={styles.p}>Error: {error.message}</p>
  ) : (
    <>
      <div style={styles.container}>
        {currentMeals?.map((meal) => (
          <div key={meal.idMeal} style={styles.card}>
            <h2>{meal.strMeal}</h2>
            <img src={meal.strMealThumb} alt={meal.strMeal} style={styles.img} />
          </div>
        ))}
      </div>
      <div style={styles.pagination}>
        <button
          style={{
            ...styles.button,
            ...(currentPage === 1 ? styles.disabledButton : {}),
          }}
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            style={{
              ...styles.button,
              ...(currentPage === index + 1 ? styles.activeButton : {}),
            }}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          style={{
            ...styles.button,
            ...(currentPage === totalPages ? styles.disabledButton : {}),
          }}
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default DataFetcher;
