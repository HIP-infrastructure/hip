import * as React from 'react'
// import { InputText } from 'primereact/inputtext';
// import { TreeSelect } from 'primereact/treeselect';
// import TreeNode from 'primereact/treenode';
// import { Button } from 'primereact/button'
// import { Card } from 'primereact/card';
import 'primeflex/primeflex.css';
import {
    API_REMOTE_APP,
} from '../api/gatewayClientAPI'
import { useAppStore } from '../store/appProvider'

interface FormData {
    name?: string;
    age?: string;
    sex?: string;
    ieeg?: any;
    imaging?: {
        dcm?: any;
        nii?: any;
    }
}

// const Convert = ({ nodes }: { nodes?: TreeNode[] }) => {
//     const {
// 		user: [user],
// 	} = useAppStore()
//     const [formData, setFormData] = React.useState<FormData>({})

//     // React.useEffect(() => {
//     //     console.log(formData)
//     // }, [formData])

//     const findPathForDocument = (key?: string): string | undefined => {

//         if (!(key && nodes)) 
//             return

//         const findNode = (node: TreeNode, key: string): TreeNode | undefined => node.key === key ?
//             node :
//             node.children?.reduce((result: TreeNode | undefined, n) => result || findNode(n, key), undefined)

//         return findNode({ key: 'null', children: nodes }, key)?.data.path;
//     }

//     const handleBIDSConvert = async () => {
//         const params = {
//             ...formData,
//             ieeg: findPathForDocument(formData.ieeg),
//             imaging: {
//                 dcm: findPathForDocument(formData.imaging?.dcm),
//                 nii: findPathForDocument(formData.imaging?.nii),
//             },
//             owner: user?.displayName
//         }

//         try {
//             const response = await fetch(`${API_REMOTE_APP}/bids`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(params),
//             })

//             const data = await response.json()
//             // console.log(data)
            
//             // return { data, error: null }
//         } catch (error) {
//             // return { data: null, error }
//         }
//     }

//     const footer = <span>
//         <Button label="Convert" icon="pi pi-check" style={{ marginRight: '.25em' }} onClick={handleBIDSConvert} />
//         {/* <Button label="Cancel" icon="pi pi-times" className="p-button-secondary" /> */}
//     </span>;

//     return (
//         <Card footer={footer} title="BIDS Converter" subTitle="Instructions for BIDS converter">
//             <form>
//                 <div className="p-fluid p-formgrid p-grid">
//                     <span className="p-field p-col">
//                         <InputText id="name" value={formData.name} onChange={(e) => setFormData(prevFormData =>
//                         ({
//                             ...prevFormData,
//                             name: e.target.value
//                         })
//                         )} />
//                         <label htmlFor="name">Name</label>
//                     </span>
//                     <span className="p-field p-col">
//                         <InputText id="age" value={formData.age} onChange={(e) => setFormData(prevFormData =>
//                         ({
//                             ...prevFormData,
//                             age: e.target.value
//                         })
//                         )} />
//                         <label htmlFor="age">Age</label>
//                     </span>
//                     <span className="p-field p-col">
//                         <InputText
//                             id="sex"
//                             value={formData.sex}
//                             onChange={(e) => setFormData(prevFormData =>
//                             ({
//                                 ...prevFormData,
//                                 sex: e.target.value
//                             })
//                             )}
//                         />
//                         <label htmlFor="sex">Sex</label>
//                     </span>
//                 </div>
//                 <div className="p-fluid p-formgrid p-grid">
//                     <span className="p-field p-col">
//                         <h5>IEEG</h5>
//                         <TreeSelect
//                             value={formData.ieeg}
//                             options={nodes}
//                             onChange={(e) => setFormData(prevFormData =>
//                             ({
//                                 ...prevFormData,
//                                 ieeg: e.target.value
//                             })
//                             )}
//                             filter
//                             placeholder="Select Items">
//                         </TreeSelect>
//                     </span>
//                     <span className="p-field p-col">
//                         <h5>Imaging: DICOM</h5>
//                         <TreeSelect
//                             value={formData.imaging?.dcm}
//                             options={nodes}
//                             onChange={(e) => setFormData(prevFormData =>
//                             ({
//                                 ...prevFormData,
//                                 imaging: {
//                                     ...prevFormData.imaging,
//                                     dcm: e.target.value
//                                 }
//                             })
//                             )}
//                             filter
//                             placeholder="Select Items">
//                         </TreeSelect>
//                     </span>
//                     <span className="p-field p-col">
//                         <h5>Imaging: NIFTI</h5>
//                         <TreeSelect
//                             value={formData.imaging?.nii}
//                             options={nodes}
//                             onChange={(e) => setFormData(prevFormData =>
//                             ({
//                                 ...prevFormData,
//                                 imaging: {
//                                     ...prevFormData.imaging,
//                                     nii: e.target.value
//                                 }
//                             })
//                             )}
//                             filter
//                             placeholder="Select Items">
//                         </TreeSelect>
//                     </span>
//                 </div>
//             </form>
//         </Card>
//     )
// }

export default <div>Data</div> 