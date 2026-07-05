export const translations = {
  en: {
    nav: {
      appName: "Lanka Trails",
      appDesc: "Sri Lanka Travel Planner",
      dashboard: "Dashboard",
      logout: "Logout",
      langToggle: "සිංහල",
      steps: {
        search: "Search",
        plan: "Plan",
        optimize: "Optimize",
        itinerary: "Itinerary"
      }
    },
    home: {
      nav: {
        cta: "Get started"
      },
      hero: {
        eyebrow: "Sri Lanka, mapped stop by stop",
        title1: "Every stop planned.",
        title2: "Every route optimal.",
        subtitle: "Pick the places you want to see across Sri Lanka. Lanka Trails orders them into the shortest route, gets you bus, train or car directions for each leg, and swaps in an indoor stop the moment the weather turns.",
        ctaPrimary: "Plan your trip",
        ctaSecondary: "See how it works",
        trust1: "Free to plan",
        trust2: "Google-grade routing",
        trust3: "Live weather checks"
      },
      ticket: {
        route: "Route No.",
        distance: "Distance",
        stops: "Stops",
        optimal: "Optimal",
        gate: "Alert",
        rain: "Rain · Ella",
        swap: "Indoor swap ready"
      },
      how: {
        eyebrow: "Boarding sequence",
        title1: "How it",
        title2: "works",
        subtitle: "Four steps from an idea to a trip you can actually follow."
      },
      steps: {
        search: {
          title: "Search your places",
          body: "Look up a city or a specific attraction and see the top matches — ratings, photos and opening hours included."
        },
        plan: {
          title: "Build your stop list",
          body: "Add places from as many searches as you like, then reorder them into the trip you actually want."
        },
        optimize: {
          title: "Optimize the route",
          body: "One tap reorders every stop into the shortest possible journey, with or without a fixed finish line."
        },
        go: {
          title: "Start and stay guided",
          body: "Get bus, train and driving directions for every leg, live weather checks, and indoor backups if the sky turns on you."
        }
      },
      features: {
        eyebrow: "Stamped on arrival",
        title1: "Built for",
        title2: "real trips",
        subtitle: "Every feature exists because a trip in Sri Lanka actually needs it.",
        search: {
          title: "Destination search",
          body: "Top attractions for any city or place, pulled straight from Google Places."
        },
        optimize: {
          title: "Route optimization",
          body: "Your stops, reordered into the shortest path — round trip or fixed destination."
        },
        transit: {
          title: "Bus, train & car",
          body: "Real route numbers, station timings and driving directions for every leg of the journey."
        },
        weather: {
          title: "Weather-aware rerouting",
          body: "Rain at an outdoor stop? Get nearby indoor alternatives automatically."
        },
        live: {
          title: "Live trip tracking",
          body: "Start your trip and get notified as you move from one stop to the next."
        },
        ai: {
          title: "AI trip assistant",
          body: "Describe the vibe you want and let the assistant suggest places to add."
        }
      },
      cta: {
        title: "Your route to Sri Lanka starts here.",
        subtitle: "Search a few places, and let the route build itself.",
        button: "Start planning free"
      }
    },
    auth: {
      loginTitle: "Login",
      registerTitle: "Register",
      loginSub: "Log in to your account",
      registerSub: "Create a new account",
      fullName: "Full Name",
      email: "Email address",
      password: "Password",
      submitLogin: "Login",
      submitRegister: "Create Account",
      processing: "Processing...",
      footer: "Lanka Trails — Sri Lanka Travel Planning App"
    },
    search: {
      heroSub: "Sri Lanka's best travel planner",
      heroTitle1: "Plan your",
      heroTitle2: "Journey",
      startPointTitle: "Starting Point",
      startPlaceholder: "Eg: Colombo, Maharagama, My Home...",
      searchPlacesTitle: "Search places to visit",
      searchCityBtn: "Search by City",
      searchSpecificBtn: "Search Specific Place",
      searchCityPlaceholder: "Type a city... (Eg: Kandy)",
      searchSpecificPlaceholder: "Type a place... (Eg: Lotus Tower)",
      searchBtn: "Search",
      noPlacesErr: "Please enter a starting point",
      selectAtLeastOneErr: "Please select at least one place",
      selectedPlaces: "Selected Places",
      nextBtn: "Plan My Trip",
      nearbyPlaces: "Places near",
      searchResults: "Results for",
      add: "Add",
      remove: "Remove",
      open: "Open",
      closed: "Closed"
    },
    plan: {
      title1: "Organize your",
      title2: "Trip",
      subtitle: "Order places and set departure time",
      startTime: "Trip Start Time",
      placesList: "Travel Locations",
      noPlaces: "No places found. Go back and search.",
      startBadge: "Start",
      endBadge: "End",
      routePreview: "Route Preview",
      segments: "segments",
      nextBtn: "Optimize Route"
    },
    optimize: {
      title1: "Route",
      title2: "Optimize",
      subtitle: "The best route from your starting point",
      endLocationLabel: "Select ending location (Optional):",
      anywhere: "-- Optimize Freely (Anywhere) --",
      reoptimizeBtn: "Re-Optimize",
      hint: "* If not selected, places will be ordered by nearest to the starting point.",
      loading: "Querying Google Directions API...",
      skipped: "Optimization skipped (not enough places)",
      reordered: "Route reordered — Shortest path found!",
      alreadyOptimal: "Your selected order is already the shortest path",
      totalDistance: "Total Distance",
      finalRoute: "Final Route Journey",
      endingAt: "Ending at",
      nextBtn: "Generate Itinerary"
    },
    dashboard: {
      title: "My Trips Dashboard",
      subtitle: "All your travel plans",
      newTripBtn: "New Trip",
      noTrips: "No Trips Yet",
      noTripsSub: "Plan your first adventure!",
      createTripBtn: "Create a Trip",
      status: {
        planned: "Planned",
        active: "Active 🔴",
        completed: "Completed ✓"
      },
      startBtn: "Start Trip",
      continueBtn: "Continue",
      viewBtn: "View Trip",
      places: "places"
    },
    activeTrip: {
        stops: "Stops",
        currentStop: "Current Stop",
        weatherLoading: "Loading weather...",
        weatherAlert: "Weather Alert!",
        indoorSuggestions: "Indoor Alternatives:",
        dismiss: "Dismiss",
        navigateBtn: "Navigate via Google Maps",
        routeMap: "Route Map",
        noMapEmbed: "Google Maps Embed",
        mapKeyMissing: "Please add VITE_GOOGLE_MAPS_KEY to .env",
        openMapBtn: "Open in Google Maps →",
        allStops: "All Stops",
        youAreHere: "← You are here",
        nextStopTitle: "Next Stop",
        saving: "Saving...",
        tripComplete: "Trip Completed! 🎉",
        nextStopBtn: "Next Stop"
        },
    saveModal: {
  title: "Save Trip",
  subtitle: "Save your travel plan for later",
  success: "Trip saved successfully! 🎉",
  tripName: "Trip Name *",
  tripNamePlaceholder: "Eg: Kandy Day Trip, Family Vacation...",
  tripDate: "Trip Date *",
  route: "Route Preview",
  start: "Start",
  notes: "Notes (Optional)",
  notesPlaceholder: "Any extra notes...",
  errName: "Please enter a trip title",
  errDate: "Please select a trip date",
  errSave: "Save failed. Please try again.",
  cancel: "Cancel",
  saving: "Saving...",
  saveBtn: "Save Trip"
},  

itinerary: {
      title1: "Your",
      title2: "Itinerary",
      subtitle: "Step-by-step travel guide",
      loadingTitle: "Generating Itinerary...",
      loadingSub: "Finding the best routes for you",
      busRoutes: "Bus Routes",
      trainSchedules: "Train Schedules",
      driving: "Driving",
      error: "Failed to generate itinerary. Please try again.",
      totalStops: "Total Stops",
      segments: "Segments",
      startTime: "Start Time",
      readyTitle: "You're all set!",
      saveBtn: "Save Trip",
      segment: "Segment",
      notAvailable: "Not available",
      hideDetails: "Hide Details",
      showDetails: "Show Details",
      stops: "stops"
},
profile: {
      title: "Profile & Settings",
      langTitle: "App Language",
      selectLang: "Select Language",
      securityTitle: "Security",
      changePw: "Change Password",
      updatePwBtn: "Update Password"
    },
    common: {
      back: "Back",
      retry: "Retry",
      save: "Save",
      cancel: "Cancel",
      refresh: "Refresh"
    }
  },
  
  si: {
    nav: {
      appName: "Lanka Trails",
      appDesc: "ශ්‍රී ලංකා සංචාරක සැලසුම්කරු",
      dashboard: "ඩෑෂ්බෝඩ්",
      logout: "ඉවත් වන්න",
      langToggle: "English",
      steps: {
        search: "සොයන්න",
        plan: "සැලසුම්",
        optimize: "ප්‍රශස්ත",
        itinerary: "ගමන් විස්තරය"
      }
    },
    home: {
      nav: {
        cta: "පටන් ගමු"
      },
      hero: {
        eyebrow: "ශ්‍රී ලංකාව, එක එක ස්ථානයෙන් සිතියම් ගත කෙරේ",
        title1: "සෑම නැවතුමක්ම සැලසුම් සහගතයි.",
        title2: "සෑම මාර්ගයක්ම ප්‍රශස්තයි.",
        subtitle: "ශ්‍රී ලංකාව පුරා ඔබ බලන්න ඕන ස්ථාන තෝරන්න. Lanka Trails ඒවා කෙටිම මාර්ගයට සකසලා, සෑම කොටසකටම බස්, දුම්රිය හෝ වාහන directions ලබාදෙනවා, කාලගුණය නරක උනොත් ගෘහස්ථ විකල්පයක්ම ලබාදෙනවා.",
        ctaPrimary: "ඔබේ ගමන සැලසුම් කරන්න",
        ctaSecondary: "මෙය ක්‍රියා කරන ආකාරය බලන්න",
        trust1: "සැලසුම් කිරීම නොමිලේ",
        trust2: "Google-grade routing",
        trust3: "සජීවී කාලගුණ පරීක්ෂාව"
      },
      ticket: {
        route: "මාර්ග අංකය",
        distance: "දුර",
        stops: "නැවතුම්",
        optimal: "ප්‍රශස්තයි",
        gate: "අනතුරු ඇඟවීම",
        rain: "වර්ෂාව · Ella",
        swap: "ගෘහස්ථ විකල්පය සූදානම්"
      },
      how: {
        eyebrow: "ගමන් පිළිවෙල",
        title1: "මෙය",
        title2: "ක්‍රියා කරන ආකාරය",
        subtitle: "අදහසේ සිට අනුගමනය කළ හැකි ගමනක් දක්වා පියවර හතරක්."
      },
      steps: {
        search: {
          title: "ඔබේ ස්ථාන සොයන්න",
          body: "නගරයක් හෝ නිශ්චිත ස්ථානයක් සොයන්න, hොඳම ප්‍රතිඵල — rating, photos සහ open hours සමඟ."
        },
        plan: {
          title: "ඔබේ නැවතුම් ලැයිස්තුව සාදන්න",
          body: "ඔබට ඕන තරම් search කරලා ස්ථාන එකතු කරන්න, පසුව ඒවා ඔබට ඕන ගමනට reorder කරගන්න."
        },
        optimize: {
          title: "මාර්ගය Optimize කරන්න",
          body: "එක tap එකකින් සෑම නැවතුමක්ම කෙටිම ගමනට reorder වෙනවා, fixed finish location එකක් සමඟ හෝ නැතුව."
        },
        go: {
          title: "ආරම්භ කර මාර්ගෝපදේශය ලබාගන්න",
          body: "සෑම කොටසකටම බස්, දුම්රිය සහ වාහන directions, සජීවී කාලගුණ පරීක්ෂා, කාලගුණය නරක උනොත් ගෘහස්ථ විකල්ප."
        }
      },
      features: {
        eyebrow: "පැමිණි විට මුද්‍රා තබන ලද",
        title1: "සැබෑ ගමන් සඳහා",
        title2: "නිර්මාණය කළා",
        subtitle: "ශ්‍රී ලංකාවේ ගමනකට ඇත්තටම ඕන නිසා තමයි මේ features ඔක්කොම තියෙන්නේ.",
        search: {
          title: "ස්ථාන සෙවීම",
          body: "ඕනෑම නගරයක හෝ ස්ථානයක top attractions, Google Places එකෙන් කෙළින්ම."
        },
        optimize: {
          title: "Route Optimization",
          body: "ඔබේ නැවතුම් කෙටිම මාර්ගයට reorder කෙරේ — round trip හෝ fixed destination."
        },
        transit: {
          title: "බස්, දුම්රිය සහ වාහන",
          body: "සැබෑ route numbers, station timings සහ driving directions සෑම ගමන් කොටසකටම."
        },
        weather: {
          title: "කාලගුණය අනුව Rerouting",
          body: "ගෘහස්ථ නොවන ස්ථානයක වර්ෂාවක්ද? ළඟම ගෘහස්ථ විකල්ප ස්වයංක්‍රීයව ලබාගන්න."
        },
        live: {
          title: "සජීවී Trip Tracking",
          body: "ඔබේ ගමන ආරම්භ කර, එක නැවතුමකින් තව නැවතුමකට යනකොට notifications ලබාගන්න."
        },
        ai: {
          title: "AI ගමන් සහායක",
          body: "ඔබට ඕන vibe එක විස්තර කරන්න, AI සහායක ඔබට ස්ථාන යෝජනා කරයි."
        }
      },
      cta: {
        title: "ශ්‍රී ලංකාවට ඔබේ මාර්ගය මෙතනින් පටන් ගනී.",
        subtitle: "ස්ථාන කිහිපයක් search කරන්න, මාර්ගය ස්වයංක්‍රීයව හැදෙන්න දෙන්න.",
        button: "නොමිලේ සැලසුම් කිරීම අරඹන්න"
      }
    },
    auth: {
      loginTitle: "ඇතුල් වන්න",
      registerTitle: "ලියාපදිංචි වන්න",
      loginSub: "ඔබගේ ගිණුමට ඇතුල් වන්න",
      registerSub: "නව ගිණුමක් සාදන්න",
      fullName: "සම්පූර්ණ නම",
      email: "ඊමේල් ලිපිනය",
      password: "මුරපදය",
      submitLogin: "ඇතුල් වන්න",
      submitRegister: "ගිණුම සාදන්න",
      processing: "සකසමින් පවතී...",
      footer: "Lanka Trails — ශ්‍රී ලංකා සංචාරක සැලසුම්කරු"
    },
    search: {
      heroSub: "ශ්‍රී ලංකාවේ හොඳම travel planner",
      heroTitle1: "ඔබේ ගමන",
      heroTitle2: "සැලසුම් කරන්න",
      startPointTitle: "ගමන ආරම්භ කරන ස්ථානය",
      startPlaceholder: "උදා: Colombo, Maharagama...",
      searchPlacesTitle: "යන්න ඕනෙ ස්ථාන හොයන්න",
      searchCityBtn: "නගරයකින් හොයන්න",
      searchSpecificBtn: "නිශ්චිත ස්ථානයක් හොයන්න",
      searchCityPlaceholder: "නගරයක් type කරන්න... (Eg: Kandy)",
      searchSpecificPlaceholder: "ස්ථානයක් type කරන්න... (Eg: Lotus Tower)",
      searchBtn: "සොයන්න",
      noPlacesErr: "කරුණාකර ආරම්භක ස්ථානය ඇතුලත් කරන්න",
      selectAtLeastOneErr: "අවම වශයෙන් එක ස්ථානයක්වත් තෝරන්න",
      selectedPlaces: "තෝරාගත් ස්ථාන",
      nextBtn: "මගේ ගමන අරඹන්න",
      nearbyPlaces: "අවට ඇති ස්ථාන",
      searchResults: "සඳහා ප්‍රතිඵල",
      add: "එකතු කරන්න",
      remove: "ඉවත් කරන්න",
      open: "විවෘතයි",
      closed: "වසා ඇත"
    },
    plan: {
      title1: "ගමන",
      title2: "සකස් කරන්න",
      subtitle: "ස්ථාන order කරන්න, ගමන් වේලාව set කරන්න",
      startTime: "ගමන ආරම්භ කරන වේලාව",
      placesList: "ගමන් ස්ථාන",
      noPlaces: "ස්ථාන නැත. Search page එකෙන් add කරන්න.",
      startBadge: "ආරම්භය",
      endBadge: "අවසානය",
      routePreview: "ගමන් මාර්ගය",
      segments: "කොටස්",
      nextBtn: "Route Optimize කරන්න"
    },
    optimize: {
      title1: "මාර්ගය",
      title2: "ප්‍රශස්ත කිරීම",
      subtitle: "ඔබේ ආරම්භක ස්ථානයේ සිට හොඳම ගමන් මාර්ගය",
      endLocationLabel: "ගමන අවසන් කරන ස්ථානයක් ඇත්නම් තෝරන්න (Optional):",
      anywhere: "-- නිදහසේ Optimize කරන්න (ඕනෑම තැනකින් අවසන් කරන්න) --",
      reoptimizeBtn: "නැවත Optimize කරන්න",
      hint: "* තේරුවේ නැත්නම්, ආරම්භක ස්ථානයේ සිට ළඟම පිළිවෙලට ස්ථාන සකසනු ඇත.",
      loading: "මාර්ග දත්ත පරීක්ෂා කරමින්...",
      skipped: "ස්ථාන මදි නිසා Optimization skip කළා",
      reordered: "Route reorder කළා — වඩාත් කෙටිම මාර්ගය හමු විණ!",
      alreadyOptimal: "ඔබ තෝරාගත් පිළිවෙල දැනටමත් කෙටිම මාර්ගයයි",
      totalDistance: "සම්පූර්ණ දුර",
      finalRoute: "අවසාන ගමන් මාර්ගය",
      endingAt: "අවසන් වන්නේ",
      nextBtn: "Itinerary Generate කරන්න"
    },
    dashboard: {
      title: "ගමන් Dashboard",
      subtitle: "ඔබේ සියලු ගමන් සැලසුම්",
      newTripBtn: "නව ගමනක්",
      noTrips: "ගමන් නැත",
      noTripsSub: "ඔබේ පළමු ගමන සැලසුම් කරන්න!",
      createTripBtn: "ගමනක් සාදන්න",
      status: {
        planned: "සැලසුම් කළ",
        active: "ක්‍රියාකාරී 🔴",
        completed: "සම්පූර්ණයි ✓"
      },
      startBtn: "ගමන ආරම්භ කරන්න",
      continueBtn: "දිගටම යන්න",
      viewBtn: "ගමන බලන්න",
      places: "ස්ථාන"
    },
    activeTrip: {
        stops: "ස්ථාන",
        currentStop: "දැන් ඔබ සිටින ස්ථානය",
        weatherLoading: "කාලගුණය පරීක්ෂා කරමින්...",
        weatherAlert: "කාලගුණ අනතුරු ඇඟවීමයි!",
        indoorSuggestions: "ගෘහස්ථ ස්ථාන යෝජනා:",
        dismiss: "ඉවත් කරන්න",
        navigateBtn: "Google Maps නිරායාසයෙන් පිවිසෙන්න",
        routeMap: "ගමන් මාර්ගය",
        noMapEmbed: "Google Maps Embed",
        mapKeyMissing: "VITE_GOOGLE_MAPS_KEY .env file එකට add කරන්න",
        openMapBtn: "Google Maps විවෘත කරන්න →",
        allStops: "සියලු ස්ථාන",
        youAreHere: "← ඔබ දැන් සිටින ස්ථානය",
        nextStopTitle: "ඊළඟ ස්ථානය",
        saving: "සුරකිමින්...",
        tripComplete: "ගමන සම්පූර්ණයි! 🎉",
        nextStopBtn: "ඊළඟ ස්ථානයට"
        },
      saveModal: {
  title: "ගමන සුරකින්න",
  subtitle: "ඔබේ ගමන් සැලැස්ම Save කරගන්න",
  success: "ගමන සාර්ථකව සුරැකිනි! 🎉",
  tripName: "ගමනේ නම *",
  tripNamePlaceholder: "උදා: නුවර ගමන, Family Vacation...",
  tripDate: "ගමන් දිනය *",
  route: "ගමන් මාර්ගය",
  start: "ආරම්භය",
  notes: "සටහන් (Optional)",
  notesPlaceholder: "අමතර සටහන්...",
  errName: "කරුණාකර ගමනේ නමක් ඇතුලත් කරන්න",
  errDate: "කරුණාකර ගමන් දිනයක් තෝරන්න",
  errSave: "සුරැකීම අසාර්ථකයි. නැවත උත්සාහ කරන්න.",
  cancel: "අවලංගු කරන්න",
  saving: "සුරකිමින්...",
  saveBtn: "Trip Save කරන්න"
},  
itinerary: {
      title1: "ඔබේ",
      title2: "ගමන් විස්තරය",
      subtitle: "පියවරෙන් පියවර මාර්ගෝපදේශය",
      loadingTitle: "ගමන් විස්තරය සකසමින්...",
      loadingSub: "හොඳම මාර්ග සොයමින් පවතී...",
      busRoutes: "බස් මාර්ග",
      trainSchedules: "දුම්රිය කාලසටහන්",
      driving: "වාහන ගමන්",
      error: "ගමන් විස්තරය ලබාගැනීමට නොහැකි විය. නැවත උත්සාහ කරන්න.",
      totalStops: "නැවතුම් ගණන",
      segments: "කොටස්",
      startTime: "ආරම්භක වේලාව",
      readyTitle: "සියල්ල සූදානම්!",
      saveBtn: "ගමන Save කරන්න",
      segment: "කොටස",
      notAvailable: "ලබා ගත නොහැක",
      hideDetails: "විස්තර සඟවන්න",
      showDetails: "විස්තර පෙන්වන්න",
      stops: "නැවතුම්"
    },
    profile: {
      title: "ගිණුම සහ සැකසුම්",
      langTitle: "යෙදුමේ භාෂාව",
      selectLang: "භාෂාව තෝරන්න",
      securityTitle: "ආරක්ෂාව",
      changePw: "මුරපදය වෙනස් කරන්න",
      updatePwBtn: "මුරපදය යාවත්කාලීන කරන්න"
    },
    common: {
      back: "ආපසු",
      retry: "නැවත උත්සහ කරන්න",
      save: "සුරකින්න",
      cancel: "අවලංගු කරන්න",
      refresh: "Refresh"
    }
  }
};