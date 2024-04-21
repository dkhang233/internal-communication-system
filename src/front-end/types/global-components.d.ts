import SvgIcon from "@/components/SvgIcon/index.vue"

/** Components registered globally by app.component need to declare the TS type here to obtain the type hints provided by the Volar plug-in) */
declare module "vue" {
  export interface GlobalComponents {
    SvgIcon: typeof SvgIcon
  }
}

export {}
