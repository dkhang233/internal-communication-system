import "vue-router"

declare module "vue-router" {
  interface RouteMeta {
    /**
     * Set the name of the route displayed in the sidebar and breadcrumbs
     */
    title?: string
    /**
     * Set the icon of the route, remember to import svg into @/icons/svg
     */
    svgIcon?: string
    /**
     * To set the icon of this route, directly use the Icon of Element Plus (when set at the same time as svgIcon, svgIcon will take effect first)
     */
    elIcon?: string
    /**
     * Default is false. When set to true, the route will not appear in the sidebar.
     */
    hidden?: boolean
    /**
     * Set the roles that can enter the route and support the superposition of multiple roles
     */
    roles?: string[]
    /**
     * Default true, if set to false, it will not be displayed in breadcrumbs
     */
    breadcrumb?: boolean
    /**
     * Default false, if set to true, it will be fixed in tags-view
     */
    affix?: boolean
    /**
     * When there are more than 1 routes declared by children under a route, it will automatically become a nested mode.
     * When there is only one, that sub-route will be displayed in the sidebar as the root route.
     * If you want to display your root route regardless of the number of children declared under the route,
     * You can set alwaysShow: true, so that the previously defined rules will be ignored and the root route will always be displayed.
     */
    alwaysShow?: boolean
    /**
     * Example: activeMenu: "/xxx/xxx"，
     * When entering routing with this attribute set, the sidebar corresponding to the activeMenu attribute will be highlighted.
     * This attribute is suitable for use on routes with the hidden: true attribute
     */
    activeMenu?: string
    /**
     * Whether to cache the routing page
     * The default is false. When it is true, it means caching is required. At this time, both the route and the page need to set a consistent Name.
     */
    keepAlive?: boolean
  }
}
