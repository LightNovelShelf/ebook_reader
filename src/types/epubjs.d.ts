import { Book as Book85, Rendition as Rendition85, EpubCFI as EpubCFI85, Contents as Contents85 } from 'epubjs85'
import { Book as BookLast, Rendition as RenditionLast, EpubCFI as EpubCFILast, Contents as ContentsLast } from 'epubjs'

export declare type Book = BookLast | Book85
export declare type Rendition = RenditionLast | Rendition85
export declare type EpubCFI = EpubCFILast | EpubCFI85
export declare type Contents = ContentsLast | Contents85

import { RenditionOptions as RenditionOptionsLast } from 'epubjs/types/rendition'
import { RenditionOptions as RenditionOptions85 } from 'epubjs85/types/rendition'
export declare type RenditionOptions = RenditionOptionsLast | RenditionOptions85

import { PackagingMetadataObject as PackagingMetadataObjectLast } from 'epubjs/types/packaging'
import { PackagingMetadataObject as PackagingMetadataObject85 } from 'epubjs85/types/packaging'
export declare type PackagingMetadataObject = PackagingMetadataObjectLast | PackagingMetadataObject85

import { NavItem as NavItemLast } from 'epubjs/types/navigation'
import { NavItem as NavItem85 } from 'epubjs85/types/navigation'
export declare type NavItem = NavItemLast | NavItem85
