import Loading from "../../pages/Loading";
import { getUserToken } from "../../helpers/userInfo";
import { Certificate } from "../../interfaces/Certificate";
import CertificateCard from "./CertificateCard";
import { useEffect, useState } from "react";
import CertificateService from "../../services/certificate.services";

export default function CertificateList() {
	const token = getUserToken();

	const [certificates, setCertificates] = useState<Certificate[]>();

	useEffect(() => {
		CertificateService.getAllCertificates().then((res) => {
			setCertificates(res);
		});
	}, []);

	if (!certificates) return <Loading />;
	return (
		<div className="flex flex-col pb-4">
			{certificates.length ?
				<>
					<div className="w-full">
						<h1 className="text-3xl font-semibold">Certificates</h1>
						<p className="text-grayMedium">You have {certificates.length} certificates</p>
					</div>
					{certificates.map((certificate: Certificate, key: number) => (
						<CertificateCard certificate={certificate} key={key} />
					))} 
				</> :
				<div className="text-xl">Empty</div>
      }
		</div>
	)
}
