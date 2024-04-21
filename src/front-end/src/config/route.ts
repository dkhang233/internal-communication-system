/** Routing configuration */
interface RouteSettings {
  /**
   * Whether to enable dynamic routing function?
   * 1. After it is turned on, it requires back-end cooperation. In the user details query interface, the fields that the current user can use to determine and load dynamic routing are returned (this project uses the roles field)
   * 2. If the project does not need to display different pages according to different users, it should be dynamic: false
   */
  dynamic: boolean
  /** When the dynamic routing function is turned off:
   * 1. All routes should be written into the resident route (indicating that all logged-in users can access the same pages)
   * 2. The system automatically assigns a default role that has no effect to the currently logged in user.
   */
  defaultRoles: Array<string>
  /**
   * Whether to enable the route caching function at level 3 and above?
   * 1. After being enabled, routing will be downgraded (routes of level three and above will be converted into level two routes).
   * 2. Since all routes will be converted to secondary routes, embedded sub-routes for secondary and above routes will be invalid.
   */
  thirdLevelRouteCache: boolean
}

const routeSettings: RouteSettings = {
  dynamic: true,
  defaultRoles: ["DEFAULT_ROLE"],
  thirdLevelRouteCache: false
}

export default routeSettings
