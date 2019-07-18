import React, { Fragment } from 'react';
import $ from 'jquery';
import DownloadButton from '../../DownloadButton';
import styled from 'styled-components';
import { OnlyDesktop } from '../../styles';
import sidebar from '../sidebar';
import startCase from 'lodash.startcase';
import Preloader from '../../Preloader/Preloader';

export default class SidebarMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      names: [],
      loading: true
    }

    this.collapse = this.collapse.bind(this);
    this.getName = this.getName.bind(this);
  }

  collapse() {
    setTimeout(function () {
      $('[data-open=true]').slideDown();
      $('[data-open=false]').slideUp();
    })
  }

  getNamesArr() {
    let arr = {}; //несодержательное имя переменной
    let self = this;

    sidebar.forEach(section => {
      section.files.forEach(file => {
        let folder = file.folder ? file.folder : section.folder;
        let filename = (typeof file === 'string') ? file : file.indexFile;
        arr[`${folder}/${filename}`] = startCase(filename.slice(0, -3));

        if (file.files && file.files.length > 0) {
          file.files.forEach(file2 => {
            let folder = file.folder ? file.folder : section.folder;
            let filename = file2;
            arr[`${folder}/${filename}`] = startCase(filename.slice(0, -3));
          })
        }
      })
    })

    self.setState({
      names: arr,
      loading: false
    })
  }

  componentDidMount() {
    this.collapse();
    this.getNamesArr();
  }

  getName(labels = null, folder = null, indexFile = null) {
    let name;
    if (labels && labels[indexFile]) {
      name = labels[indexFile];
    } else {
      name = this.state.names[`${folder}/${indexFile}`];
    }
    return name;
  }

  UNSAFE_componentWillReceiveProps(nextProps) { //В спеке реакта говорится, что этот метод устарел
    let cnangedPropsFile = nextProps.currentFile !== this.props.currentFile;
    let cnangedPropsSection = nextProps.currentSection !== this.props.currentSection;
    if (cnangedPropsFile || cnangedPropsSection) {
      this.collapse();
    }
  }

  render() {
    let self = this;
    function includes(array, folder) {
      let flag = false;
      array.forEach(elem => {
        if (`${folder}/${elem}` === self.props.currentFile) {
          flag = true;
        }
      })
      return flag;
    }
    const { sidebar, currentSection, currentFile, onSectionSelect, getLinkHref } = this.props;

    return !this.state.loading ? (
      <Menu id='sidebar-menu'>
        <Sections>
          <SectionLinks>
            {sidebar.forEach((section, index) => {
              const isSectionActive = currentSection === index;
              let sectionTitle = section.name
                ? section.name
                : this.getName(section.labels, section.folder, section.indexFile);
              return (
                <div key={index}>
                  <SectionLink />
                  <SectionToggler />
                </div>
              )
            })}
          </SectionLinks>
        </Sections>
        <OnlyDesktop>
          <SideFooter>
            <DownloadButton openTop />
          </SideFooter>
        </OnlyDesktop>
      </Menu>
    ) : (
        <Menu id='sidebar-menu'>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              flexDirection: 'column',
              margin: '44px 34px 0 0'
            }}
          >
            <Preloader size={24} />
          </div>
        </Menu>
      )
  }
}

// Компоненты

// При извлечении компонентов и последующем расположении сохранил иерархию от самого 'глубокого' к 'внешнему'
function SubgroupToggler() {
  return (
    <div className='SubgroupToggler'
      data-flag='first'
      data-open={isFileActive || includes(subgroup, file.folder
        ? file.folder
        : section.folder)
        ? 'true'
        : 'false'}
    >
    </div>
  )
  //<!-- render subrgoup (в рамках тестового задания рендеринг подгруппы реализовывать не нужно) -->
}

function Indexer() {
  return (
    <div className='Indexer' key={`file-${fileIndex}`}>
      {subgroup && (
        <SubgroupToggler />
      )}
    </div>
  )
}

function SectionToggler() {
  return (
    <div classNsme="SectionToggler" data-open={isSectionActive ? 'true' : 'false'}>
      {section.files &&
        section.files.forEach((file, fileIndex) => {
          const subgroup = file.files ? file.files : null;
          let compare = file.folder && file.indexFile
            ? `${file.folder}/${file.indexFile}`
            : `${section.folder}/${file}`;
          const isFileActive = currentFile === compare;
          return (
            <Indexer />
          )
        })}
    </div>
  )
}

function SectionLink() {
  return (
    <div classname="SectionLink"
      level={1}
      href={getLinkHref(index)}
      onClick={e => onSectionSelect(e, index)}
      className={isSectionActive ? 'docSearch-lvl0' : ''}
      isActive={isSectionActive}
    >
      {sectionTitle}
    </div>
  )
}

const Menu = styled.div`
  position: sticky;
  top: 60px;
  width: 100%;
  height: calc(100vh - 138px);
  overflow-y: auto;
`
const Sections = styled.div`
  margin-bottom: 25px;
  margin-top: 10px;
  min-width: 280px;
`
const SectionLinks = styled.div`
  @media (max-width: 768px) {
    position: relative;
  }
`
const SectionLink = styled.a`
  display: block;
  position: relative;
  font-size: 18px;
  font-weight: 500;
  color: #b0b8c5;
  }
  ${props =>
    props.level === 1 &&
    `
    margin-left: 5px;
  `} ${props =>
    props.level === 2 &&
    `
    margin-left: 30px;
  `};
  ${props =>
    props.level === 3 &&
    `
    margin-left: 45px;
  `};
  ${props =>
    props.isActive &&
    `
    color: #40364d;
	`};
`
const SubgroupToggler = styled.div` //уточнить поведение css in js
  display: none;
`
const SectionToggler = styled.div` //уточнить поведение css in js
  display: none;
`
const SideFooter = styled.div`
  margin-top: 30px;
  padding-bottom: 30px;
`
