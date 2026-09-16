import { Link } from 'react-router-dom'
import './Documents.css'

const documents = [
  { documentId: 1, title: '신규 입사자 업무 안내', originalFileName: '신규입사자_업무안내.pdf', author: '김민서', enrollDate: '2026-09-16', fileSize: '1.2 MB' },
  { documentId: 2, title: '프로젝트 운영 가이드', originalFileName: '프로젝트_운영가이드.docx', author: '이준호', enrollDate: '2026-09-15', fileSize: '840 KB' },
  { documentId: 3, title: '사내 문서 보안 정책', originalFileName: '문서보안정책.pdf', author: '박지영', enrollDate: '2026-09-14', fileSize: '620 KB' },
  { documentId: 4, title: '주간 업무 회의록', originalFileName: '주간회의록_0911.docx', author: '정수빈', enrollDate: '2026-09-11', fileSize: '156 KB' },
]

function Documents() {
  return (
    <>
      <header className="documents-header">
        <h1>문서 관리</h1>
        <Link className="document-submit documents-create-link" to="/documents/new">문서 등록</Link>
      </header>
      <div className="documents-table-wrapper" role="region" aria-label="문서 목록" tabIndex={0}>
        <table className="documents-table">
          <thead>
            <tr>
              <th scope="col">문서 제목</th>
              <th scope="col">원본 파일명</th>
              <th scope="col">작성자</th>
              <th scope="col">등록일</th>
              <th scope="col" className="documents-file-size">파일 크기</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((document) => (
              <tr key={document.documentId}>
                <td><Link to={`/documents/${document.documentId}`}>{document.title}</Link></td>
                <td>{document.originalFileName}</td>
                <td>{document.author}</td>
                <td><time dateTime={document.enrollDate}>{document.enrollDate}</time></td>
                <td className="documents-file-size">{document.fileSize}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Documents