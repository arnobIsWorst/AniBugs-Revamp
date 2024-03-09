const requests = {
    requestAnimes: `http://localhost:5000/api/animes`,
    requestByGenre: `http://localhost:5000/api/animebygenre/`,
    requestAllGenres: `http://localhost:5000/api/genres`,
    requestlogin: `http://localhost:5000/api/login`,
    requestlogout: `http://localhost:5000/api/logout`,
    requestregister: `http://localhost:5000/api/register`,
    requestbookmark: `http://localhost:5000/api/bookmark/`,
    requestshowbookmark: `http://localhost:5000/api/getbookmarkanime/`,
    requestdeletebookmark: `http://localhost:5000/api/deletebookmark/`,
    requestGenresOfAnime: `http://localhost:5000/api/getgenresofanime/`,
    requestLatestAnimes: `http://localhost:5000/api/getlatestanimes`,
    requestTopRatedAnimes: `http://localhost:5000/api/gettopratedanimes`,
    requestSingleAnime: `http://localhost:5000/api/getanimebyid/`,
    requestCharactersOfAnime: `http://localhost:5000/api/getcharactersofanime/`,
    requestReviewsOfAnime: `http://localhost:5000/api/getreviewsofanime/`,
    requestReviewsOfCharacter: `http://localhost:5000/api/getreviewsofcharacter/`,
    requestRelatedAnimes: `http://localhost:5000/api/getrelatedanimes/`,
    requestStudioAndSeasonOfAnime: `http://localhost:5000/api/studioseason/`,
    requestCharacter: `http://localhost:5000/api/getcharacter/`,
    requestAnimeByCharacter: `http://localhost:5000/api/getanimebycharacter/`,
    requestStudioLogin: `http://localhost:5000/api/studiologin`,
    requestSearchAnime: `http://localhost:5000/api/searchanime/`,
    requestPuyrchaseHistory: `http://localhost:5000/api/getpurchasehistory/`,
    requestUserFollows: `http://localhost:5000/api/getuserfollows/`,
    requestUserReviews: `http://localhost:5000/api/getuserreviews/`
};

export default requests