import axios from 'axios'
import requests from './Requests'

export async function getAllAnimes() {
  const response = await axios.get(requests.requestAnimes)
  if (!response.data) {
    throw {
        message: 'Failed to fetch Data',
        success: false
    }
  }
  return response.data
}

export async function getGenresOfAnime(animeid) {
  const response = await axios.get(requests.requestGenresOfAnime + animeid)
  if (!response.data) {
    throw {
        message: 'Failed to fetch Data',
        success: false
    }
  }
  return response.data
}

export async function getLatestAnimes() {
  const response = await axios.get(requests.requestLatestAnimes)
  if (!response.data) {
    throw {
        message: 'Failed to fetch Data',
        success: false
    }
  }
  return response.data
}

export async function getAllGenres() {
  const response = await axios.get(requests.requestAllGenres)
  if (!response.data) {
    throw {
        message: 'Failed to fetch Data',
        success: false
    }
  }
  return response.data
}

export async function getTopRatedAnimes() {
  const response = await axios.get(requests.requestTopRatedAnimes)
  if (!response.data) {
    throw {
        message: 'Failed to fetch Data',
        success: false
    }
  }
  return response.data
}

export async function getAnimeById(id) {
  const response = await axios.get(requests.requestSingleAnime + id)
  if (!response.data) {
    throw {
        message: 'Failed to fetch Data',
        success: false
    }
  }
  return response.data
}

export async function getCharactersOfAnime(animeid) {
  //console.log(animeid)
  const response = await axios.get(requests.requestCharactersOfAnime + animeid)
  if (!response.data) {
    throw {
        message: 'Failed to fetch Data',
        success: false
    }
  }
  return response.data
}

export async function getReviewsOfAnime(animeid) {
  const response = await axios.get(requests.requestReviewsOfAnime + animeid)
  if (!response.data) {
    throw {
        message: 'Failed to fetch Data',
        success: false
    }
  }
  return response.data
}

export async function getReviewsOfCharacter(characterid) {
  const response = await axios.get(requests.requestReviewsOfCharacter + characterid)
  if (!response.data) {
    throw {
        message: 'Failed to fetch Data',
        success: false
    }
  }
  return response.data

}

export async function getRelatedAnimes(animeid) {
  const response = await axios.get(requests.requestRelatedAnimes + animeid)
  if (!response.data) {
    throw {
        message: 'Failed to fetch Data',
        success: false
    }
  }
  return response.data
}

export async function getStudioAndSeasonOfAnime(animeid) {
  
  const response = await axios.get(requests.requestStudioAndSeasonOfAnime + animeid)
  if (!response.data) {
    throw {
        message: 'Failed to fetch Data',
        success: false
    }
  }
  return response.data.studio
}

export async function getCharacter(id) {
  const response = await axios.get(requests.requestCharacter + id)
  if (!response.data) {
    throw {
        message: 'Failed to fetch Data',
        success: false
    }
  }
  return response.data
}

export async function getAnimeByCharacter(id) {
  console.log(id)
  //const response = await axios.get(requests.requestAnimeByCharacter + id)
  if (!response.data) {
    throw {
        message: 'Failed to fetch Data',
        success: false
    }
  }
  return response.data.animes
}

export async function getBookmarkedAnimes(id) {
  //console.log(requests.requestshowbookmark+id)
  const response = await axios.get(requests.requestshowbookmark+id)
  //console.log(requests.requestshowbookmark+userid)
  if (!response.data) {
    throw {
        message: 'Failed to fetch Data',
        success: false
    }
  }
  return response.data
}

export async function searchAnime(name) {
  const response = await axios.get(requests.requestSearchAnime + name)
  if (!response.data) {
    throw {
        message: 'Failed to fetch Data',
        success: false
    }
  }
  return response.data.animes
}

export async function getPurchaseHistory(userid) {
  const response = await axios.get(requests.requestPuyrchaseHistory + userid)
  if (!response.data) {
    throw {
        message: 'Failed to fetch Data',
        success: false
    }
  }
  return response.data.purchases
}

export async function getUserFollows(userid) {
  const response = await axios.get(requests.requestUserFollows + userid)
  if (!response.data) {
    throw {
        message: 'Failed to fetch Data',
        success: false
    }
  }
  return response.data.studios
}

export async function getUserReviews(userid) {
  const response = await axios.get(requests.requestUserReviews + userid)
  if (!response.data) {
    throw {
        message: 'Failed to fetch Data',
        success: false
    }
  }
  return response.data
}