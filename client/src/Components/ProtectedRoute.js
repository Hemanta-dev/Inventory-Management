// import React, { useEffect } from "react";
// import { Route, useHistory, useLocation } from "react-router";
// import Cookies from "js-cookie";

// const ProtectedRoute = ({ component: Component, ...rest }) => {
//   const history = useHistory();
//   const location = useLocation();

//   useEffect(() => {
//     const jwtoken = Cookies.get("jwtoken");

//     // Add your authentication logic here
//     // Example: Check if the token is valid or has expired
//     if (!jwtoken) {
//       // Redirect the user to the login page or any other page
//       // when authentication fails
//       // For example:
//       history.push("/login");
//     }
//   }, [history]);

//   return (
//     <Route
//       {...rest}
//       render={(props) =>
//         Cookies.get("jwtoken") ? (
//           <Component {...props} />
//         ) : (
//           history.push({
//             pathname: "/login",
//             state: { from: location },
//           })
//         )
//       }
//     />
//   );
// };

// export default ProtectedRoute;
