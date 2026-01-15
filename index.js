const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const resetButton = document.getElementById("resetButton");

const keywords = ["beach", "temple", "country", "brazil", "japan", "australia"];

searchButton.addEventListener("click", () => {
  const query = searchInput.value.toLowerCase();
  for (const keyword of keywords) {
    if (query.includes(keyword)) {
      if (keyword === "beach") {
        beachRecommendations();
      } else if (keyword === "temple") {
        templeRecommendations();
      } else if (keyword === "country") {
        countryRecommendations("");
      } else if (keyword === "brazil") {
        countryRecommendations("brazil");
      } else if (keyword === "japan") {
        countryRecommendations("japan");
      } else if (keyword === "australia") {
        countryRecommendations("australia");
      }
      return;
    }
  }
  alert("No recommendations found for the given input.");
});

resetButton.addEventListener("click", () => {
  searchInput.value = "";
  const container = document.getElementById("recommendations-container");
  container.innerHTML = "";
});

fetch("./travel_recommendation_api.json")
  .then((response) => response.json())
  .then((data) => {
    console.log("Countries:");
    data.countries.forEach((country) => {
      console.log(country.name);

      country.cities.forEach((city) => {
        console.log("  - " + city.name);
      });
    });

    console.log("\nTemples:");
    data.temples.forEach((temple) => {
      console.log(temple.name);
    });

    console.log("\nBeaches:");
    data.beaches.forEach((beach) => {
      console.log(beach.name);
    });
  })
  .catch((error) => console.error("Error:", error));

// For each of these three keywords, your results should display at least two recommendations, an image, and a description.
function beachRecommendations() {
  fetch("./travel_recommendation_api.json")
    .then((response) => response.json())
    .then((data) => {
      let recommendations = [];
      if (data.beaches && data.beaches.length > 0) {
        recommendations.push(...data.beaches);
      }

      if (data.countries) {
        data.countries.forEach((country) => {
          country.cities.forEach((city) => {
            if (
              city.description &&
              city.description.toLowerCase().includes("beach")
            ) {
              recommendations.push(city);
            }
          });
        });
      }

      displayRecommendations(recommendations, "beach");
    })
    .catch((error) => console.error("Error:", error));
}

function templeRecommendations() {
  fetch("./travel_recommendation_api.json")
    .then((response) => response.json())
    .then((data) => {
      let recommendations = [];
      if (data.temples && data.temples.length > 0) {
        recommendations.push(...data.temples);
      }
      if (data.countries) {
        data.countries.forEach((country) => {
          country.cities.forEach((city) => {
            if (
              city.description &&
              city.description.toLowerCase().includes("temple")
            ) {
              recommendations.push(city);
            }
          });
        });
      }

      displayRecommendations(recommendations, "temple");
    })
    .catch((error) => console.error("Error:", error));
}

function countryRecommendations(countryName) {
  fetch("./travel_recommendation_api.json")
    .then((response) => response.json())
    .then((data) => {
      let recommendations = [];
      if (data.countries && data.countries.length > 0) {
        data.countries.forEach((country) => {
          if (
            countryName.length === 0 ||
            country.name.toLowerCase() === countryName.toLowerCase()
          ) {
            country.cities.forEach((city) => {
              recommendations.push(city);
            });
          }
        });
      }
      displayRecommendations(recommendations, "country");
    })
    .catch((error) => console.error("Error:", error));
}

function displayRecommendations(recommendations, type) {
  const container = document.getElementById("recommendations-container");
  container.innerHTML = "";

  if (recommendations.length === 0) {
    container.innerHTML = "<p>No recommendations found.</p>";
    return;
  }

  recommendations.forEach((item) => {
    const card = document.createElement("div");
    card.className = "recommendation-card";

    card.innerHTML = `
      <img src="${item.imageUrl}" alt="${item.name}" class="recommendation-image">
      <div class="recommendation-content">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
      </div>
    `;

    container.appendChild(card);
  });
}
