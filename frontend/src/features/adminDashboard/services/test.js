import axios from "axios";

async function getGithubUser(username) {
  try {
    const response = await axios.get(
      `https://api.github.com/users/${username}`
    );

    console.log("Nom :", response.data.name);
    console.log("Login :", response.data.login);
    console.log("Repos publics :", response.data.public_repos);
  } catch (error) {
    console.error("Erreur :", error.message);
  }
}

getGithubUser("Eth4nUmm");