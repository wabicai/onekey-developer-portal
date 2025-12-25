import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'
import MdxImage from './components/MdxImage.jsx'

const docsComponents = getDocsMDXComponents()

export function useMDXComponents(components) {
  return {
    ...docsComponents,
    img: MdxImage,
    ...components,
  }
}
